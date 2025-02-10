import type { ReadableBox } from "svelte-toolbelt";
import { watch } from "runed";
import { on } from "svelte/events";
import type { EscapeBehaviorType, EscapeLayerImplProps } from "./types.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import { noop } from "$lib/internal/noop.js";

globalThis.bitsEscapeLayers ??= new Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>();

type EscapeLayerStateProps = ReadableBoxedValues<Required<Omit<EscapeLayerImplProps, "children">>>;

export class EscapeLayerState {
	constructor(readonly opts: EscapeLayerStateProps) {
		let unsubEvents = noop;
		watch(
			() => opts.enabled.current,
			(enabled) => {
				if (enabled) {
					globalThis.bitsEscapeLayers.set(this, opts.escapeKeydownBehavior);
					unsubEvents = this.#addEventListener();
				}

				return () => {
					unsubEvents();
					globalThis.bitsEscapeLayers.delete(this);
				};
			}
		);
	}

	#addEventListener = () => {
		return on(document, "keydown", this.#onkeydown, { passive: false });
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.ESCAPE || !isResponsibleEscapeLayer(this)) return;
		const clonedEvent = new KeyboardEvent(e.type, e);
		e.preventDefault();
		const behaviorType = this.opts.escapeKeydownBehavior.current;
		if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close") return;
		this.opts.onEscapeKeydown.current(clonedEvent);
	};
}

export function useEscapeLayer(props: EscapeLayerStateProps) {
	return new EscapeLayerState(props);
}

function isResponsibleEscapeLayer(instance: EscapeLayerState) {
	const layersArr = [...globalThis.bitsEscapeLayers];
	/**
	 * We first check if we can find a top layer with `close` or `ignore`.
	 * If that top layer was found and matches the provided node, then the node is
	 * responsible for the escape. Otherwise, we know that all layers defer so
	 * the first layer is the responsible one.
	 */
	const topMostLayer = layersArr.findLast(
		([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore"
	);
	if (topMostLayer) return topMostLayer[0] === instance;
	const [firstLayerNode] = layersArr[0]!;
	return firstLayerNode === instance;
}
