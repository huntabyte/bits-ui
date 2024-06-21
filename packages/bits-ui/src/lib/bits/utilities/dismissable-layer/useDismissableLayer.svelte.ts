import { untrack } from "svelte";
import { box, type ReadableBox, type WritableBox } from "svelte-toolbelt";
import type {
	DismissableLayerImplProps,
	InteractOutsideBehaviorType,
	InteractOutsideEvent,
	InteractOutsideInterceptEventType,
} from "./types.js";
import {
	type EventCallback,
	type ReadableBoxedValues,
	addEventListener,
	afterTick,
	composeHandlers,
	debounce,
	executeCallbacks,
	getOwnerDocument,
	isElement,
	isOrContainsTarget,
	noop,
	useRefById,
} from "$lib/internal/index.js";

const layers = new Map<DismissableLayerState, ReadableBox<InteractOutsideBehaviorType>>();

const interactOutsideStartEvents = [
	"pointerdown",
	"touchstart",
] satisfies InteractOutsideInterceptEventType[];
const interactOutsideEndEvents = [
	"pointerup",
	"touchend",
	"click",
] satisfies InteractOutsideInterceptEventType[];

type DismissableLayerStateProps = ReadableBoxedValues<
	Required<Omit<DismissableLayerImplProps, "children">>
>;

export class DismissableLayerState {
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
	#onFocusOutside: DismissableLayerStateProps["onFocusOutside"];
	currNode = $state<HTMLElement | null>(null);

	constructor(props: DismissableLayerStateProps) {
		this.#enabled = props.enabled;

		useRefById({
			id: props.id,
			ref: this.node,
			condition: () => this.#enabled.value,
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
			if (this.#enabled.value) {
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

		$effect(() => {
			return () => {
				// onDestroy, cleanup anything leftover
				untrack(() => {
					this.#resetState.destroy();
					layers.delete(this);
					this.#onInteractOutsideStart.destroy();
					this.#onInteractOutside.destroy();
					unsubEvents();
				});
			};
		});
	}

	#handleFocus = (event: FocusEvent) => {
		if (event.defaultPrevented) return;
		if (!this.currNode) return;
		afterTick(() => {
			if (!this.currNode || this.#isTargetWithinLayer(event.target as HTMLElement)) return;

			if (event.target && !this.#isFocusInsideDOMTree) {
				this.#onFocusOutside.value?.(event);
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
				composeHandlers(this.#markInterceptedEvent, this.#markResponsibleLayer),
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
				composeHandlers(this.#markInterceptedEvent, this.#resetState),
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
				composeHandlers(this.#markNonInterceptedEvent, this.#onInteractOutsideStart)
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
		console.log("interact outside start");
		if (!this.currNode) {
			console.log("no node");
			return;
		}
		if (
			!this.#isResponsibleLayer ||
			this.#isAnyEventIntercepted() ||
			!isValidEvent(e, this.currNode)
		) {
			console.log("returning early here");
			return;
		}
		this.#interactOutsideStartProp.value(e);
		if (e.defaultPrevented) return;
		this.#isPointerDownOutside = true;
	}, 10);

	#onInteractOutside = debounce((e: InteractOutsideEvent) => {
		console.log("interacting outside");
		if (!this.currNode) return;

		const behaviorType = this.#behaviorType.value;

		console.log("this.#isResponsibleLayer", this.#isResponsibleLayer);
		console.log("this.#isAnyEventIntercepted()", this.#isAnyEventIntercepted());
		console.log("isValidEvent", isValidEvent(e, this.currNode));
		if (
			!this.#isResponsibleLayer ||
			this.#isAnyEventIntercepted() ||
			!isValidEvent(e, this.currNode)
		) {
			console.log("returning early here");
			return;
		}
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		console.log("this.#isPointerDownOutside", this.#isPointerDownOutside);
		if (!this.#isPointerDownOutside) return;
		console.log("calling interact outside prop");
		this.#interactOutsideProp.value(e);
	}, 10);

	#markInterceptedEvent = (e: HTMLElementEventMap[InteractOutsideInterceptEventType]) => {
		this.#interceptedEvents[e.type as InteractOutsideInterceptEventType] = true;
	};

	#markNonInterceptedEvent = (e: HTMLElementEventMap[InteractOutsideInterceptEventType]) => {
		this.#interceptedEvents[e.type as InteractOutsideInterceptEventType] = false;
	};

	#markResponsibleLayer = () => {
		if (!this.node.value) return;
		this.#isResponsibleLayer = isResponsibleLayer(this.node.value);
	};

	#isTargetWithinLayer = (target: HTMLElement) => {
		if (!this.node.value) return false;
		return isOrContainsTarget(this.node.value, target);
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

export function useDismissableLayer(props: DismissableLayerStateProps) {
	return new DismissableLayerState(props);
}

function getTopMostLayer(
	layersArr: [DismissableLayerState, ReadableBox<InteractOutsideBehaviorType>][]
) {
	return layersArr.findLast(
		([_, { value: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
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
	if (topMostLayer) return topMostLayer[0].node.value === node;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode.node.value === node;
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
