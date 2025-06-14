import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import type { WithRefOpts } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const aspectRatioAttrs = createBitsAttrs({
	component: "aspect-ratio",
	parts: ["root"],
});

interface AspectRatioRootStateOpts extends WithRefOpts, ReadableBoxedValues<{ ratio: number }> {}

export class AspectRatioRootState {
	static create(opts: AspectRatioRootStateOpts) {
		return new AspectRatioRootState(opts);
	}

	readonly opts: AspectRatioRootStateOpts;

	constructor(opts: AspectRatioRootStateOpts) {
		this.opts = opts;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					position: "absolute",
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				},
				[aspectRatioAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}
