import {
	type ReadableBox,
	type WritableBox,
	afterTick,
	executeCallbacks,
	onDestroyEffect,
	type ReadableBoxedValues,
	simpleBox,
} from "svelte-toolbelt";
import { watch } from "runed";
import { untrack } from "svelte";
import { on } from "svelte/events";
import type { DismissibleLayerImplProps, InteractOutsideBehaviorType } from "./types.js";
import {
	captureEventPath,
	copyEventPath,
	getEventTargetClosest,
	isEventTargetWithin,
	type EventCallback,
} from "#lib/internal/events.js";
import { debounce } from "#lib/internal/debounce.js";
import { noop } from "#lib/internal/noop.js";
import { getOwnerDocument, isOrContainsTarget } from "#lib/internal/elements.js";
import { isElementOrSVGElement } from "#lib/internal/is.js";
import { isClickTrulyOutside } from "#lib/internal/dom.js";
import {
	CONTEXT_MENU_CONTENT_ATTR,
	CONTEXT_MENU_TRIGGER_ATTR,
} from "#lib/bits/menu/context-menu-attributes.js";

globalThis.bitsDismissableLayers ??= new Map<
	DismissibleLayerState,
	ReadableBox<InteractOutsideBehaviorType>
>();

interface DismissibleLayerStateOpts extends ReadableBoxedValues<
	Required<Omit<DismissibleLayerImplProps, "children" | "ref">>
> {
	ref: WritableBox<HTMLElement | null>;
}

export class DismissibleLayerState {
	static create(opts: DismissibleLayerStateOpts) {
		return new DismissibleLayerState(opts);
	}
	readonly opts: DismissibleLayerStateOpts;
	// The handlers below run from document listeners, which keep firing while a parent's
	// outro holds this layer inert. Reading `opts` then warns `derived_inert`, so they read
	// what the effect in the constructor last saw: effects don't run while inert.
	#interactOutsideSnapshot: EventCallback<PointerEvent> = noop;
	#isValidEventSnapshot: DismissibleLayerStateOpts["isValidEvent"]["current"] = () => false;
	#nodeSnapshot: HTMLElement | null = null;
	#behaviorType = simpleBox<InteractOutsideBehaviorType>("close");
	#interceptedEvents: Record<string, boolean> = {
		pointerdown: false,
	};
	#isResponsibleLayer = false;
	#capturedPointerDown: PointerEvent | null = null;
	#isFocusInsideDOMTree = false;
	#documentObj = undefined as unknown as Document;
	#onFocusOutsideSnapshot: DismissibleLayerStateOpts["onFocusOutside"]["current"] = noop;
	#unsubClickListener = noop;
	/**
	 * Set once the layer is torn down. Deferred work scheduled before teardown can
	 * still run afterwards, so every such callback must short-circuit on this
	 * before using `this.#nodeSnapshot`. A class field rather than a constructor
	 * local so the class-field handlers below can see it too.
	 */
	#destroyed = false;

	constructor(opts: DismissibleLayerStateOpts) {
		this.opts = opts;

		$effect.pre(() => {
			this.#behaviorType.current = opts.interactOutsideBehavior.current;
			this.#interactOutsideSnapshot = opts.onInteractOutside.current;
			this.#onFocusOutsideSnapshot = opts.onFocusOutside.current;
			this.#isValidEventSnapshot = opts.isValidEvent.current;
			this.#nodeSnapshot = opts.ref.current;
		});

		let unsubEvents = noop;
		let registeredNode: HTMLElement | null = null;

		const cleanup = () => {
			registeredNode = null;
			this.#resetState();
			globalThis.bitsDismissableLayers.delete(this);
			this.#handleInteractOutside.destroy();
			this.#unsubClickListener();
			unsubEvents();
		};

		watch([() => this.opts.enabled.current, () => this.opts.ref.current], ([enabled, node]) => {
			const nextNode = enabled ? node : null;
			// Ref boxes can invalidate without changing the DOM node during opening.
			// Keep an in-flight interaction when this is still the same registration.
			if (registeredNode === nextNode) return;
			cleanup();
			if (!nextNode) return;
			registeredNode = nextNode;
			this.#documentObj = getOwnerDocument(nextNode);
			globalThis.bitsDismissableLayers.set(this, this.#behaviorType);
			unsubEvents = this.#addEventListeners();
		});

		onDestroyEffect(() => {
			this.#destroyed = true;
			cleanup();
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (this.#destroyed || !this.#nodeSnapshot) return;
		afterTick(() => {
			// The layer can be destroyed between the focus event and this tick — a
			// focus change is frequently what closes it. `#destroyed` must
			// short-circuit before `this.#nodeSnapshot` is used.
			if (this.#destroyed) return;
			if (!this.#nodeSnapshot || this.#isTargetWithinLayer(event.target as HTMLElement))
				return;

			if (event.target && !this.#isFocusInsideDOMTree) {
				this.#onFocusOutsideSnapshot?.(event);
			}
		});
	};

	#addEventListeners() {
		const document = this.#documentObj;
		const onPointerDownCapture = (event: PointerEvent) => {
			untrack(() => {
				// settle the previous interaction before this one overwrites its state
				this.#handleInteractOutside.flush();
				this.#markInterceptedEvent(event);
				this.#markResponsibleLayer(event);
			});
		};
		const onPointerDown = (event: PointerEvent) => {
			// Ignore stopped events and bubble-only events such as the opening pointerdown.
			// It can resume bubbling after a nested early outside click has been captured.
			if (event.cancelBubble || event !== this.#capturedPointerDown) return;
			this.#markNonInterceptedEvent(event);
			if (event.pointerType === "touch") {
				// a tap's click can follow its pointerdown within a millisecond (WebKit), so
				// arm the click listener now rather than after the debounce flushes
				this.#handleInteractOutside.destroy();
				this.#interactOutside(event);
			} else {
				this.#handleInteractOutside(event);
			}
		};

		// `svelte/events.on` defers pointer listener attachment to a microtask, leaving
		// a gap even without a registration timer. Document is already connected, so
		// attach immediately. Only layers present at capture can own this interaction;
		// a layer opened by its target/bubble handlers must not dismiss itself.
		document.addEventListener("pointerdown", onPointerDownCapture, true);
		document.addEventListener("pointerdown", onPointerDown);

		return executeCallbacks(
			() => document.removeEventListener("pointerdown", onPointerDownCapture, true),
			() => document.removeEventListener("pointerdown", onPointerDown),
			on(document, "focusin", this.#handleFocus)
		);
	}

	#handleDismiss = (e: MouseEvent) => {
		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(e);
		}
		this.#interactOutsideSnapshot(e as PointerEvent);
	};

	#interactOutside = (e: PointerEvent) => {
		if (!this.#nodeSnapshot) {
			this.#unsubClickListener();
			return;
		}
		const isEventValid =
			this.#isValidEventSnapshot(e, this.#nodeSnapshot) ||
			isValidEvent(e, this.#nodeSnapshot);

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

			// the tap's click dismisses from the bubble phase, as before. A capture-phase
			// listener backs it up with a task, so a target that stops propagation cannot
			// hide the click, while a target that closes this layer still tears it down
			// (and the backup with it) before the task runs.
			let backup: ReturnType<typeof setTimeout> | null = null;
			let unsubClick = noop;
			const dismiss = (event: MouseEvent) => {
				unsubClick();
				this.#handleDismiss(event);
			};
			unsubClick = executeCallbacks(
				on(this.#documentObj, "click", dismiss, { once: true }),
				on(
					this.#documentObj,
					"click",
					(event: MouseEvent) => {
						captureEventPath(event);
						backup = setTimeout(() => dismiss(event), 0);
					},
					{ once: true, capture: true }
				),
				() => {
					if (backup !== null) clearTimeout(backup);
					backup = null;
				}
			);
			this.#unsubClickListener = unsubClick;
		} else {
			this.#interactOutsideSnapshot(event);
		}
	};

	#handleInteractOutside = debounce(this.#interactOutside, 10);

	#markInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = true;
	};

	#markNonInterceptedEvent = (e: PointerEvent) => {
		this.#interceptedEvents[e.type] = false;
	};

	#markResponsibleLayer = (event: PointerEvent) => {
		this.#capturedPointerDown = event;
		captureEventPath(event);
		if (!this.#nodeSnapshot) return;
		this.#isResponsibleLayer = isResponsibleLayer(this);
	};

	#isTargetWithinLayer = (target: HTMLElement) => {
		if (!this.#nodeSnapshot) return false;
		return isOrContainsTarget(this.#nodeSnapshot, target);
	};

	/**
	 * Resets the per-interaction state. Must stay synchronous.
	 *
	 * This was a `debounce(..., 20)` from when it was also wired to a capture-phase
	 * interaction-end listener and had to land after the 10ms `#handleInteractOutside`
	 * debounce. That listener is gone, but the debounce stayed on the `cleanup()` path —
	 * and because `watch` runs `cleanup()` once per open (`ref` goes null -> node), every
	 * layer scheduled a reset 20ms into its own lifetime. An outside `pointerdown` landing
	 * 10-20ms after that cleanup would have its `#isResponsibleLayer` flag cleared by the
	 * stale reset in the gap before the debounced `#handleInteractOutside` ran, which then
	 * bailed and left the layer open. `cleanup()` destroys `#handleInteractOutside` anyway,
	 * so nothing is left in flight that needs to observe the pre-reset state.
	 */
	#resetState = () => {
		for (const eventType in this.#interceptedEvents) {
			this.#interceptedEvents[eventType] = false;
		}
		this.#isResponsibleLayer = false;
		this.#capturedPointerDown = null;
	};

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

export function getTopMostDismissableLayer(
	layersArr: [DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>][] = [
		...globalThis.bitsDismissableLayers,
	]
) {
	return layersArr.findLast(
		([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
}

function isResponsibleLayer(layer: DismissibleLayerState): boolean {
	const layersArr = [...globalThis.bitsDismissableLayers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and is the provided layer, then that layer is
	 * responsible for the outside interaction. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = getTopMostDismissableLayer(layersArr);
	if (topMostLayer) return topMostLayer[0] === layer;
	const [firstLayer] = layersArr[0]!;
	return firstLayer === layer;
}

function isValidEvent(e: PointerEvent, node: HTMLElement): boolean {
	const target = e.target;
	if (!isElementOrSVGElement(target)) return false;

	const targetIsContextMenuTrigger = Boolean(
		getEventTargetClosest(e, `[${CONTEXT_MENU_TRIGGER_ATTR}]`)
	);
	const nodeIsContextMenu = Boolean(node.closest(`[${CONTEXT_MENU_CONTENT_ATTR}]`));

	if ("button" in e && e.button > 0 && !targetIsContextMenuTrigger) return false;
	if ("button" in e && e.button === 0 && targetIsContextMenuTrigger && nodeIsContextMenu) {
		return true;
	}
	if (targetIsContextMenuTrigger && nodeIsContextMenu) return false;

	const ownerDocument = getOwnerDocument(target);
	const isValid =
		ownerDocument.documentElement.contains(target) &&
		!isEventTargetWithin(e, node) &&
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
				// oxlint-disable-next-line no-explicit-any
				const value = (target as any)[prop];
				return typeof value === "function" ? value.bind(target) : value;
			}
			// oxlint-disable-next-line no-explicit-any
			const value = (e as any)[prop];
			return typeof value === "function" ? value.bind(e) : value;
		},
	});

	copyEventPath(e, wrappedEvent);
	return wrappedEvent as PointerEvent;
}
