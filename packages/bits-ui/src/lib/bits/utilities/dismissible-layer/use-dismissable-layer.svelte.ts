import {
	type ReadableBox,
	type WritableBox,
	afterSleep,
	afterTick,
	executeCallbacks,
	onDestroyEffect,
	type ReadableBoxedValues,
} from "svelte-toolbelt";
import { watch } from "runed";
import { on } from "svelte/events";
import type { DismissibleLayerImplProps, InteractOutsideBehaviorType } from "./types.js";
import { type EventCallback, addEventListener } from "$lib/internal/events.js";
import { debounce } from "$lib/internal/debounce.js";
import { noop } from "$lib/internal/noop.js";
import { getOwnerDocument, isOrContainsTarget } from "$lib/internal/elements.js";
import { isElement } from "$lib/internal/is.js";
import { isClickTrulyOutside } from "$lib/internal/dom.js";

globalThis.bitsDismissableLayers ??= new Map<
	DismissibleLayerState,
	ReadableBox<InteractOutsideBehaviorType>
>();

interface DismissibleLayerStateOpts
	extends ReadableBoxedValues<Required<Omit<DismissibleLayerImplProps, "children" | "ref">>> {
	ref: WritableBox<HTMLElement | null>;
}

export class DismissibleLayerState {
	static create(opts: DismissibleLayerStateOpts) {
		return new DismissibleLayerState(opts);
	}
	readonly opts: DismissibleLayerStateOpts;
	#interactOutsideProp: ReadableBox<EventCallback<PointerEvent>>;
	#behaviorType: ReadableBox<InteractOutsideBehaviorType>;
	#interceptedEvents: Record<string, boolean> = {
		pointerdown: false,
	};
	#isResponsibleLayer = false;
	#isFocusInsideDOMTree = false;
	#documentObj = undefined as unknown as Document;
	#onFocusOutside: DismissibleLayerStateOpts["onFocusOutside"];
	#unsubClickListener = noop;

	constructor(opts: DismissibleLayerStateOpts) {
		this.opts = opts;

		this.#behaviorType = opts.interactOutsideBehavior;
		this.#interactOutsideProp = opts.onInteractOutside;
		this.#onFocusOutside = opts.onFocusOutside;

		$effect(() => {
			this.#documentObj = getOwnerDocument(this.opts.ref.current);
		});

		let unsubEvents = noop;

		const cleanup = () => {
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			unsubEvents();
		};

		watch([() => this.opts.enabled.current, () => this.opts.ref.current], () => {
			if (!this.opts.enabled.current || !this.opts.ref.current) return;
			afterSleep(1, () => {
				if (!this.opts.ref.current) return;
				globalThis.bitsDismissableLayers.set(this, this.#behaviorType);

				unsubEvents();
				unsubEvents = this.#addEventListeners();
			});
			return cleanup;
		});

		onDestroyEffect(() => {
			this.#resetState.destroy();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			this.#unsubClickListener();
			unsubEvents();
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (!this.opts.ref.current) return;
		afterTick(() => {
			if (!this.opts.ref.current || this.#isTargetWithinLayer(event.target as HTMLElement))
				return;

			if (event.target && !this.#isFocusInsideDOMTree) {
				this.#onFocusOutside.current?.(event);
			}
		});
	};

	#addEventListeners() {
		return executeCallbacks(
			/**
			 * CAPTURE INTERACTION START
			 * mark interaction-start event as intercepted.
			 * mark responsible layer during interaction start
			 * to avoid checking if is responsible layer during interaction end
			 * when a new floating element may have been opened.
			 */
			on(
				this.#documentObj,
				"pointerdown",
				executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer),
				{ capture: true }
			),

			/**
			 * BUBBLE INTERACTION START
			 * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
			 * to avoid prematurely checking if other events were intercepted.
			 */
			on(
				this.#documentObj,
				"pointerdown",
				executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)
			),

			/**
			 * HANDLE FOCUS OUTSIDE
			 */
			on(this.#documentObj, "focusin", this.#handleFocus)
		);
	}

	#handleDismiss = (e: PointerEvent) => {
		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(e);
		}
		this.#interactOutsideProp.current(e as PointerEvent);
	};

	#handleInteractOutside = debounce((e: PointerEvent) => {
		if (!this.opts.ref.current) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid =
			this.opts.isValidEvent.current(e, this.opts.ref.current) ||
			isValidEvent(e, this.opts.ref.current);

		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			this.#unsubClickListener();
			return;
		}

		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(event);
		}

		if (
			this.#behaviorType.current !== "close" &&
			this.#behaviorType.current !== "defer-otherwise-close"
		) {
			this.#unsubClickListener();
			return;
		}

		if (e.pointerType === "touch") {
			this.#unsubClickListener();

			// @ts-expect-error - later
			this.#unsubClickListener = addEventListener(
				this.#documentObj,
				"click",
				this.#handleDismiss,
				{ once: true }
			);
		} else {
			this.#interactOutsideProp.current(event);
		}
	}, 10);

	#markInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = true;
	};

	#markNonInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = false;
	};

	#markResponsibleLayer = () => {
		if (!this.opts.ref.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.opts.ref.current);
	};

	#isTargetWithinLayer = (target: HTMLElement) => {
		if (!this.opts.ref.current) return false;
		return isOrContainsTarget(this.opts.ref.current, target);
	};

	#resetState = debounce(() => {
		for (const eventType in this.#interceptedEvents) {
			this.#interceptedEvents[eventType] = false;
		}
		this.#isResponsibleLayer = false;
	}, 20);

	#isAnyEventIntercepted() {
		const i = Object.values(this.#interceptedEvents).some(Boolean);
		return i;
	}

	#onfocuscapture = () => {
		this.#isFocusInsideDOMTree = true;
	};

	#onblurcapture = () => {
		this.#isFocusInsideDOMTree = false;
	};

	props = {
		onfocuscapture: this.#onfocuscapture,
		onblurcapture: this.#onblurcapture,
	};
}

function getTopMostLayer(
	layersArr: [DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>][]
) {
	return layersArr.findLast(
		([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
}

function isResponsibleLayer(node: HTMLElement): boolean {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the outside interaction. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = getTopMostLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].opts.ref.current === node;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode.opts.ref.current === node;
}

function isValidEvent(e: PointerEvent, node: HTMLElement): boolean {
	if ("button" in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;
	const ownerDocument = getOwnerDocument(target);
	const isValid =
		ownerDocument.documentElement.contains(target) &&
		!isOrContainsTarget(node, target) &&
		isClickTrulyOutside(e, node);
	return isValid;
}

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

function createWrappedEvent(e: PointerEvent | MouseEvent): PointerEvent {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;

	let newEvent: PointerEvent;

	if (e instanceof PointerEvent) {
		newEvent = new PointerEvent(e.type, e);
	} else {
		newEvent = new PointerEvent("pointerdown", e);
	}

	// track the prevented state separately
	let isPrevented = false;

	// Create a proxy to intercept property access and method calls
	const wrappedEvent = new Proxy(newEvent, {
		get: (target, prop) => {
			if (prop === "currentTarget") {
				return capturedCurrentTarget;
			}
			if (prop === "target") {
				return capturedTarget;
			}
			if (prop === "preventDefault") {
				return () => {
					isPrevented = true;
					if (typeof target.preventDefault === "function") {
						target.preventDefault();
					}
				};
			}
			if (prop === "defaultPrevented") {
				return isPrevented;
			}
			if (prop in target) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return (target as any)[prop];
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (e as any)[prop];
		},
	});

	return wrappedEvent as PointerEvent;
}
