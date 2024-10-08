import { untrack } from "svelte";
import {
	type ReadableBox,
	type WritableBox,
	afterTick,
	box,
	composeHandlers,
	executeCallbacks,
	onDestroyEffect,
	useRefById,
} from "svelte-toolbelt";
import type {
	DismissibleLayerImplProps,
	InteractOutsideBehaviorType,
	InteractOutsideEvent,
	InteractOutsideInterceptEventType,
} from "./types.js";
import { type EventCallback, addEventListener } from "$lib/internal/events.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { debounce } from "$lib/internal/debounce.js";
import { noop } from "$lib/internal/noop.js";
import { getOwnerDocument, isOrContainsTarget } from "$lib/internal/elements.js";
import { isElement } from "$lib/internal/is.js";

const layers = new Map<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>();

const interactOutsideStartEvents = [
	"pointerdown",
	"touchstart",
] satisfies InteractOutsideInterceptEventType[];
const interactOutsideEndEvents = [
	"pointerup",
	"touchend",
	"click",
] satisfies InteractOutsideInterceptEventType[];

type DismissibleLayerStateProps = ReadableBoxedValues<
	Required<Omit<DismissibleLayerImplProps, "children">>
>;

export class DismissibleLayerState {
	#interactOutsideStartProp: ReadableBox<EventCallback<InteractOutsideEvent>>;
	#interactOutsideProp: ReadableBox<EventCallback<InteractOutsideEvent>>;
	#behaviorType: ReadableBox<InteractOutsideBehaviorType>;
	#interceptedEvents: Record<InteractOutsideInterceptEventType, boolean> = {
		pointerdown: false,
		pointerup: false,
		mousedown: false,
		mouseup: false,
		touchstart: false,
		touchend: false,
		click: false,
	};
	#isPointerDownOutside = false;
	#isResponsibleLayer = false;
	node: WritableBox<HTMLElement | null> = box(null);
	#documentObj = undefined as unknown as Document;
	#enabled: ReadableBox<boolean>;
	#isFocusInsideDOMTree = $state(false);
	#onFocusOutside: DismissibleLayerStateProps["onFocusOutside"];
	currNode = $state<HTMLElement | null>(null);
	#isValidEventProp: DismissibleLayerStateProps["isValidEvent"];

	constructor(props: DismissibleLayerStateProps) {
		this.#enabled = props.enabled;
		this.#isValidEventProp = props.isValidEvent;

		useRefById({
			id: props.id,
			ref: this.node,
			deps: () => this.#enabled.current,
			onRefChange: (node) => {
				this.currNode = node;
			},
		});

		this.#behaviorType = props.interactOutsideBehavior;
		this.#interactOutsideStartProp = props.onInteractOutsideStart;
		this.#interactOutsideProp = props.onInteractOutside;
		this.#onFocusOutside = props.onFocusOutside;

		$effect(() => {
			this.#documentObj = getOwnerDocument(this.currNode);
		});

		let unsubEvents = noop;

		const cleanup = () => {
			this.#resetState();
			layers.delete(this);
			this.#onInteractOutsideStart.destroy();
			this.#onInteractOutside.destroy();
			unsubEvents();
		};

		$effect(() => {
			if (this.#enabled.current) {
				layers.set(
					this,
					untrack(() => this.#behaviorType)
				);
				untrack(() => {
					unsubEvents();
					unsubEvents = this.#addEventListeners();
				});
			}
			return () => {
				cleanup();
			};
		});

		onDestroyEffect(() => {
			this.#resetState.destroy();
			layers.delete(this);
			this.#onInteractOutsideStart.destroy();
			this.#onInteractOutside.destroy();
			unsubEvents();
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (!this.currNode) return;
		afterTick(() => {
			if (!this.currNode || this.#isTargetWithinLayer(event.target as HTMLElement)) return;

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
			addEventListener(
				this.#documentObj,
				interactOutsideStartEvents,
				executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer),
				true
			),

			/**
			 * CAPTURE INTERACTION END
			 * mark interaction-end event as intercepted. Debounce reset state to allow
			 * bubble events to be processed before resetting the state.
			 */
			addEventListener(
				this.#documentObj,
				interactOutsideEndEvents,
				executeCallbacks(this.#markInterceptedEvent, this.#resetState),
				true
			),

			/**
			 * BUBBLE INTERACTION START
			 * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
			 * to avoid prematurely checking if other events were intercepted.
			 */
			addEventListener(
				this.#documentObj,
				interactOutsideStartEvents,
				executeCallbacks(this.#markNonInterceptedEvent, this.#onInteractOutsideStart)
			),

			/**
			 * BUBBLE INTERACTION END
			 * Mark interaction-end event as non-intercepted. Debounce `onInteractOutside`
			 * to avoid prematurely checking if other events were intercepted.
			 */
			addEventListener(
				this.#documentObj,
				interactOutsideEndEvents,
				composeHandlers(this.#markNonInterceptedEvent, this.#onInteractOutside)
			),

			/**
			 * HANDLE FOCUS OUTSIDE
			 */
			addEventListener(this.#documentObj, "focusin", this.#handleFocus)
		);
	}

	#onInteractOutsideStart = debounce((e: InteractOutsideEvent) => {
		if (!this.currNode) return;

		const isEventValid =
			this.#isValidEventProp.current(e, this.currNode) || isValidEvent(e, this.currNode);

		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			return;
		}
		let event = e;
		if (event.defaultPrevented) {
			event = createWrappedEvent(event);
		}
		this.#interactOutsideStartProp.current(event);
		if (event.defaultPrevented) return;
		this.#isPointerDownOutside = true;
	}, 10);

	#onInteractOutside = debounce((e: InteractOutsideEvent) => {
		if (!this.currNode) return;

		const behaviorType = this.#behaviorType.current;
		const isEventValid =
			this.#isValidEventProp.current(e, this.currNode) || isValidEvent(e, this.currNode);

		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
			return;
		}
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		if (!this.#isPointerDownOutside) return;
		this.#interactOutsideProp.current(e);
	}, 10);

	#markInterceptedEvent = (e: HTMLElementEventMap[InteractOutsideInterceptEventType]) => {
		this.#interceptedEvents[e.type as InteractOutsideInterceptEventType] = true;
	};

	#markNonInterceptedEvent = (e: HTMLElementEventMap[InteractOutsideInterceptEventType]) => {
		this.#interceptedEvents[e.type as InteractOutsideInterceptEventType] = false;
	};

	#markResponsibleLayer = () => {
		if (!this.node.current) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.node.current);
	};

	#isTargetWithinLayer = (target: HTMLElement) => {
		if (!this.node.current) return false;
		return isOrContainsTarget(this.node.current, target);
	};

	#resetState = debounce(() => {
		for (const eventType in this.#interceptedEvents) {
			this.#interceptedEvents[eventType as InteractOutsideInterceptEventType] = false;
		}
		this.#isPointerDownOutside = false;
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

export function useDismissibleLayer(props: DismissibleLayerStateProps) {
	return new DismissibleLayerState(props);
}

function getTopMostLayer(
	layersArr: [DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>][]
) {
	return layersArr.findLast(
		([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
}

function isResponsibleLayer(node: HTMLElement): boolean {
	const layersArr = [...layers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the outside interaction. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = getTopMostLayer(layersArr);
	if (topMostLayer) return topMostLayer[0].node.current === node;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode.node.current === node;
}

function isValidEvent(e: InteractOutsideEvent, node: HTMLElement): boolean {
	if ("button" in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;
	const ownerDocument = getOwnerDocument(target);
	const isValid =
		ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target);
	return isValid;
}

export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

function createWrappedEvent(e: InteractOutsideEvent): InteractOutsideEvent {
	const capturedCurrentTarget = e.currentTarget;
	const capturedTarget = e.target;

	let newEvent: InteractOutsideEvent;

	if (e instanceof PointerEvent) {
		newEvent = new PointerEvent(e.type, e);
	} else if (e instanceof MouseEvent) {
		newEvent = new MouseEvent(e.type, e);
	} else {
		newEvent = document.createEvent("TouchEvent") as TouchEvent;
		newEvent.initEvent(e.type, e.bubbles, e.cancelable);
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
				// eslint-disable-next-line ts/no-explicit-any
				return (target as any)[prop];
			}
			// eslint-disable-next-line ts/no-explicit-any
			return (e as any)[prop];
		},
	});

	return wrappedEvent as InteractOutsideEvent;
}
