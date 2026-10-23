import {
	type ReadableBox,
	type ReadableBoxedValues,
	boxFrom,
	boxWith,
	simpleBox,
} from "svelte-toolbelt";
import { Context } from "runed";
import type { Measurable } from "$lib/internal/floating-svelte/types.js";

export const FloatingRootContext = new Context<FloatingRootState>("Floating.Root");
export const FloatingTooltipRootContext = new Context<FloatingRootState>("Floating.Root");

export class FloatingRootState {
	static create(tooltip = false) {
		return tooltip
			? FloatingTooltipRootContext.set(new FloatingRootState())
			: FloatingRootContext.set(new FloatingRootState());
	}
	customAnchorNode = simpleBox<Measurable | HTMLElement | null | string>(null);
	// `$state` so the reassignment by `FloatingAnchorState` is seen by `#anchorNode`
	triggerNode = $state.raw<ReadableBox<Measurable | HTMLElement | null>>(simpleBox(null));

	// derived rather than synced by an effect, so closed instances never compute it
	readonly #anchorNode = $derived.by(() => {
		const customAnchor = this.customAnchorNode.current;
		if (customAnchor) {
			if (typeof customAnchor === "string") return document.querySelector(customAnchor);
			return customAnchor;
		}
		return this.triggerNode.current;
	});
	readonly anchorNode: ReadableBox<Measurable | HTMLElement | null> = boxWith(
		() => this.#anchorNode
	);
}

interface FloatingAnchorStateOpts
	extends ReadableBoxedValues<{
		id: string;
		virtualEl?: Measurable | null;
		ref: Measurable | HTMLElement | null;
	}> {}

export class FloatingAnchorState {
	static create(opts: FloatingAnchorStateOpts, tooltip = false) {
		return tooltip
			? new FloatingAnchorState(opts, FloatingTooltipRootContext.get())
			: new FloatingAnchorState(opts, FloatingRootContext.get());
	}
	readonly opts: FloatingAnchorStateOpts;
	readonly root: FloatingRootState;

	constructor(opts: FloatingAnchorStateOpts, root: FloatingRootState) {
		this.opts = opts;
		this.root = root;

		if (opts.virtualEl && opts.virtualEl.current) {
			root.triggerNode = boxFrom(opts.virtualEl.current);
		} else {
			root.triggerNode = opts.ref;
		}
	}
}
