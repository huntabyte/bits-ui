import { type ReadableBox, type ReadableBoxedValues, boxFrom, simpleBox } from "svelte-toolbelt";
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
	anchorNode = simpleBox<Measurable | HTMLElement | null>(null);
	customAnchorNode = simpleBox<Measurable | HTMLElement | null | string>(null);
	triggerNode: ReadableBox<Measurable | HTMLElement | null> = simpleBox(null);

	constructor() {
		$effect(() => {
			if (this.customAnchorNode.current) {
				if (typeof this.customAnchorNode.current === "string") {
					this.anchorNode.current = document.querySelector(this.customAnchorNode.current);
				} else {
					this.anchorNode.current = this.customAnchorNode.current;
				}
			} else {
				this.anchorNode.current = this.triggerNode.current;
			}
		});
	}
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
