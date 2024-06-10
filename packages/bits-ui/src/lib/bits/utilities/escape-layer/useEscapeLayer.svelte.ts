import { untrack } from "svelte";
import type { ReadableBox } from "svelte-toolbelt";
import type { EscapeBehaviorType, EscapeLayerImplProps } from "./types.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { type EventCallback, addEventListener } from "$lib/internal/events.js";
import { kbd } from "$lib/internal/kbd.js";
import { noop } from "$lib/internal/callbacks.js";

const layers = new Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>();

type EscapeLayerStateProps = ReadableBoxedValues<Required<Omit<EscapeLayerImplProps, "children">>>;

export class EscapeLayerState {
	#onEscapeProp: ReadableBox<EventCallback<KeyboardEvent>>;
	#behaviorType: ReadableBox<EscapeBehaviorType>;
	#enabled: ReadableBox<boolean>;

	constructor(props: EscapeLayerStateProps) {
		this.#behaviorType = props.escapeKeydownBehavior;
		this.#onEscapeProp = props.onEscapeKeydown;
		this.#enabled = props.enabled;

		let unsubEvents = noop;

		$effect(() => {
			if (this.#enabled.value) {
				layers.set(
					this,
					untrack(() => this.#behaviorType)
				);
				unsubEvents = this.#addEventListener();
			}

			return () => {
				unsubEvents();
				layers.delete(this);
			};
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
