import { onDestroy } from "svelte";
import type { PreventTextSelectionOverflowLayerProps } from "./types.js";
import type { Box, ReadonlyBox, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/elements.svelte.js";
import { type EventCallback, addEventListener, composeHandlers } from "$lib/internal/events.js";
import { executeCallbacks, noop } from "$lib/helpers/callbacks.js";
import { isHTMLElement } from "$lib/internal/is.js";
import { isOrContainsTarget } from "$lib/helpers/elements.js";

type StateProps = ReadonlyBoxedValues<
	Required<Omit<PreventTextSelectionOverflowLayerProps, "children">>
>;

const layers = new Map<PreventTextSelectionOverflowLayerState, ReadonlyBox<boolean>>();

export class PreventTextSelectionOverflowLayerState {
	#onPointerDownProp: ReadonlyBox<EventCallback<PointerEvent>>;
	#onPointerUpProp: ReadonlyBox<EventCallback<PointerEvent>>;
	#enabled: ReadonlyBox<boolean>;
	#unsubSelectionLock = noop;
	#node: Box<HTMLElement | null>;

	constructor(props: StateProps) {
		this.#node = useNodeById(props.id);
		this.#enabled = props.enabled;
		this.#onPointerDownProp = props.onPointerDown;
		this.#onPointerUpProp = props.onPointerUp;

		layers.set(this, this.#enabled);
		const unsubEvents = this.#addEventListeners();

		onDestroy(() => {
			unsubEvents();
			this.#resetSelectionLock();
			layers.delete(this);
		});
	}

	#addEventListeners() {
		return executeCallbacks(
			addEventListener(document, "pointerdown", this.#pointerdown),
			addEventListener(
				document,
				"pointerup",
				composeHandlers(this.#resetSelectionLock, this.#onPointerUpProp)
			)
		);
	}

	#pointerdown = (e: PointerEvent) => {
		const node = this.#node.value;
		const target = e.target;
		if (!node || !isHTMLElement(target) || !this.#enabled.value) return;
		/**
		 * We only lock user-selection overflow if layer is the top most layer and
		 * pointerdown occured inside the node. You are still allowed to select text
		 * outside the node provided pointerdown occurs outside the node.
		 */
		if (!isHighestLayer(this) || !isOrContainsTarget(node, target)) return;
		this.#onPointerDownProp.value(e);
		if (e.defaultPrevented) return;
		this.#unsubSelectionLock = preventTextSelectionOverflow(node);
	};

	#resetSelectionLock = () => {
		this.#unsubSelectionLock();
		this.#unsubSelectionLock = noop;
	};
}

export function preventTextSelectionOverflowLayerState(props: StateProps) {
	return new PreventTextSelectionOverflowLayerState(props);
}

const getUserSelect = (node: HTMLElement) => node.style.userSelect || node.style.webkitUserSelect;

function preventTextSelectionOverflow(node: HTMLElement) {
	const body = document.body;
	const originalBodyUserSelect = getUserSelect(body);
	const originalNodeUserSelect = getUserSelect(node);
	setUserSelect(body, "none");
	setUserSelect(node, "text");
	return () => {
		setUserSelect(body, originalBodyUserSelect);
		setUserSelect(node, originalNodeUserSelect);
	};
}

function setUserSelect(node: HTMLElement, value: string) {
	node.style.userSelect = value;
	node.style.webkitUserSelect = value;
}

function isHighestLayer(instance: PreventTextSelectionOverflowLayerState) {
	const [topLayer] = [...layers].at(-1)!;
	return topLayer === instance;
}
