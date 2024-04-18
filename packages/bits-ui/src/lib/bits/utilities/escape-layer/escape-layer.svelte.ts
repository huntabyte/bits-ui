import { onDestroy } from "svelte";
import type { EscapeBehaviorType, EscapeLayerProps } from "./types.js";
import type { ReadonlyBox, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { type EventCallback, addEventListener } from "$lib/internal/events.js";
import { kbd } from "$lib/internal/kbd.js";

const layers = new Map<EscapeLayerState, ReadonlyBox<EscapeBehaviorType>>();

type EscapeLayerStateProps = ReadonlyBoxedValues<Required<Omit<EscapeLayerProps, "children">>>;

export class EscapeLayerState {
	#onEscapeProp: ReadonlyBox<EventCallback<KeyboardEvent>>;
	#behaviorType: ReadonlyBox<EscapeBehaviorType>;

	constructor(props: EscapeLayerStateProps) {
		this.#behaviorType = props.behaviorType;
		this.#onEscapeProp = props.onEscape;
		layers.set(this, this.#behaviorType);
		const unsubEvents = this.#addEventListener();
		onDestroy(() => {
			unsubEvents();
			layers.delete(this);
		});
	}

	#addEventListener() {
		return addEventListener(document, "keydown", this.#onkeydown, { passive: false });
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.ESCAPE || !isResponsibleEscapeLayer(this)) return;
		e.preventDefault();
		const behaviorType = this.#behaviorType.value;
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		this.#onEscapeProp.value(e);
	};
}

export function useEscapeLayer(props: EscapeLayerStateProps) {
	return new EscapeLayerState(props);
}

function isResponsibleEscapeLayer(instance: EscapeLayerState) {
	const layersArr = [...layers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the escape. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = layersArr.findLast(
		([_, { value: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
	if (topMostLayer) return topMostLayer[0] === instance;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode === instance;
}
