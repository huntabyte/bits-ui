import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import type { RefAttachment, WithRefOpts } from "$lib/internal/types.js";
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
	readonly attachment: RefAttachment;

	constructor(opts: AspectRatioRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					position: "relative",
					width: "100%",
					paddingBottom: `${this.opts.ratio.current ? 100 / this.opts.ratio.current : 0}%`,
				},
				[aspectRatioAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}
