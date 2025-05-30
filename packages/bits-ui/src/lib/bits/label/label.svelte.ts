import { attachRef } from "svelte-toolbelt";
import type { BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const labelAttrs = createBitsAttrs({
	component: "label",
	parts: ["root"],
});

type LabelRootStateProps = WithRefProps;
class LabelRootState {
	readonly opts: LabelRootStateProps;

	constructor(opts: LabelRootStateProps) {
		this.opts = opts;
		this.onmousedown = this.onmousedown.bind(this);
	}

	onmousedown(e: BitsMouseEvent) {
		if (e.detail > 1) e.preventDefault();
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[labelAttrs.root]: "",
				onmousedown: this.onmousedown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

export function setLabelRootState(props: LabelRootStateProps) {
	return new LabelRootState(props);
}
