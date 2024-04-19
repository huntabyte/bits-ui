import { onDestroy } from "svelte";
import type {
	DismissableLayerProps,
	InteractOutsideBehaviorType,
	InteractOutsideEvent,
	InteractOutsideInterceptEventType,
} from "./types.js";
import {
	type Box,
	type EventCallback,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	addEventListener,
	composeHandlers,
	debounce,
	executeCallbacks,
	getOwnerDocument,
	isElement,
	isOrContainsTarget,
	useNodeById,
} from "$lib/internal/index.js";

const layers = new Map<DismissableLayerState, ReadonlyBox<InteractOutsideBehaviorType>>();

const interactOutsideStartEvents = [
	"pointerdown",
	"mousedown",
	"touchstart",
] satisfies InteractOutsideInterceptEventType[];
const interactOutsideEndEvents = [
	"pointerup",
	"mouseup",
	"touchend",
	"click",
] satisfies InteractOutsideInterceptEventType[];

type DismissableLayerStateProps = ReadonlyBoxedValues<
	Required<Omit<DismissableLayerProps, "children">>
>;

export class DismissableLayerState {
	#interactOutsideStartProp: ReadonlyBox<EventCallback<InteractOutsideEvent>>;
	#interactOutsideProp: ReadonlyBox<EventCallback<InteractOutsideEvent>>;
	#behaviorType: ReadonlyBox<InteractOutsideBehaviorType>;
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
	node: Box<HTMLElement | null>;
	#documentObj = undefined as unknown as Document;

	constructor(props: DismissableLayerStateProps) {
		this.node = useNodeById(props.id);
		this.#behaviorType = props.behaviorType;
		this.#interactOutsideStartProp = props.onInteractOutsideStart;
		this.#interactOutsideProp = props.onInteractOutside;

		layers.set(this, this.#behaviorType);

		$effect(() => {
			this.#documentObj = getOwnerDocument(this.node.value);

			const unsubEvents = this.#addEventListeners();

			return () => {
				unsubEvents();
				this.#resetState.destroy();
				this.#onInteractOutsideStart.destroy();
				this.#onInteractOutside.destroy();
				layers.delete(this);
			};
		});
	}

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
			)
		);
	}

	#onInteractOutsideStart = debounce((e: InteractOutsideEvent) => {
		const node = this.node.value!;
		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isValidEvent(e, node))
			return;
		this.#interactOutsideStartProp.value(e);
		if (e.defaultPrevented) return;
		this.#isPointerDownOutside = true;
	}, 10);

	#onInteractOutside = debounce((e: InteractOutsideEvent) => {
		const node = this.node.value!;
		const behaviorType = this.#behaviorType.value;
		if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isValidEvent(e, node))
			return;
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		if (!this.#isPointerDownOutside) return;
		this.#interactOutsideProp.value(e);
	}, 10);

	#markInterceptedEvent = (e: HTMLElementEventMap[InteractOutsideInterceptEventType]) => {
		this.#interceptedEvents[e.type as InteractOutsideInterceptEventType] = true;
	};

	#markNonInterceptedEvent = (e: HTMLElementEventMap[InteractOutsideInterceptEventType]) => {
		this.#interceptedEvents[e.type as InteractOutsideInterceptEventType] = false;
	};

	#markResponsibleLayer = () => {
		const node = this.node.value!;
		this.#isResponsibleLayer = isResponsibleLayer(node);
	};

	#resetState = debounce(() => {
		for (const eventType in this.#interceptedEvents) {
			this.#interceptedEvents[eventType as InteractOutsideInterceptEventType] = false;
		}
		this.#isPointerDownOutside = false;
		this.#isResponsibleLayer = false;
	}, 20);

	#isAnyEventIntercepted() {
		return Object.values(this.#interceptedEvents).some(Boolean);
	}
}

export function useDismissableLayer(props: DismissableLayerStateProps) {
	return new DismissableLayerState(props);
}

function isResponsibleLayer(node: HTMLElement): boolean {
	const layersArr = [...layers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the outside interaction. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = layersArr.findLast(
		([_, { value: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
	if (topMostLayer) return topMostLayer[0].node.value === node;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode.node.value === node;
}

function isValidEvent(e: InteractOutsideEvent, node: HTMLElement): boolean {
	if ("button" in e && e.button > 0) return false;
	const target = e.target;
	if (!isElement(target)) return false;
	const ownerDocument = getOwnerDocument(target);
	return ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target);
}
