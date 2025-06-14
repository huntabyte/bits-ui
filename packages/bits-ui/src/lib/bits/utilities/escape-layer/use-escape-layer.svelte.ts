import { DOMContext, type Box, type ReadableBox, type ReadableBoxedValues } from "svelte-toolbelt";
import { watch } from "runed";
import { on } from "svelte/events";
import type { EscapeBehaviorType, EscapeLayerImplProps } from "./types.js";
import { kbd } from "$lib/internal/kbd.js";
import { noop } from "$lib/internal/noop.js";

globalThis.bitsEscapeLayers ??= new Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>();

interface EscapeLayerStateOpts
	extends ReadableBoxedValues<Required<Omit<EscapeLayerImplProps, "children" | "ref">>> {
	ref: Box<HTMLElement | null>;
}

export class EscapeLayerState {
	static create(opts: EscapeLayerStateOpts) {
		return new EscapeLayerState(opts);
	}
	readonly opts: EscapeLayerStateOpts;
	readonly domContext: DOMContext;

	constructor(opts: EscapeLayerStateOpts) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);

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
		return on(this.domContext.getDocument(), "keydown", this.#onkeydown, { passive: false });
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
