import { attachRef } from "svelte-toolbelt";
import type { BitsMouseEvent, WithRefOpts } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const labelAttrs = createBitsAttrs({
	component: "label",
	parts: ["root"],
});

interface LabelRootStateOpts extends WithRefOpts {}

export class LabelRootState {
	static create(opts: LabelRootStateOpts) {
		return new LabelRootState(opts);
	}

	readonly opts: LabelRootStateOpts;

	constructor(opts: LabelRootStateOpts) {
		this.opts = opts;
		this.onmousedown = this.onmousedown.bind(this);
	}

	onmousedown(e: BitsMouseEvent) {
		if (e.detail > 1) e.preventDefault();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[labelAttrs.root]: "",
				onmousedown: this.onmousedown,
				...attachRef(this.opts.ref),
			}) as const
	);
}
