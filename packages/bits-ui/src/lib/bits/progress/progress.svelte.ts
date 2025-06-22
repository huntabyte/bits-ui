import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import { createBitsAttrs } from "$lib/internal/attrs.js";
import type { RefAttachment, WithRefOpts } from "$lib/internal/types.js";

const progressAttrs = createBitsAttrs({
	component: "progress",
	parts: ["root"],
});

interface ProgressRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: number | null;
			max: number;
			min: number;
		}> {}

export class ProgressRootState {
	static create(opts: ProgressRootStateOpts) {
		return new ProgressRootState(opts);
	}

	readonly opts: ProgressRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: ProgressRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
		() =>
			({
				role: "progressbar",
				value: this.opts.value.current,
				"aria-valuemin": this.opts.min.current,
				"aria-valuemax": this.opts.max.current,
				"aria-valuenow":
					this.opts.value.current === null ? undefined : this.opts.value.current,
				"data-value":
					this.opts.value.current === null ? undefined : this.opts.value.current,
				"data-state": getProgressDataState(this.opts.value.current, this.opts.max.current),
				"data-max": this.opts.max.current,
				"data-min": this.opts.min.current,
				"data-indeterminate": this.opts.value.current === null ? "" : undefined,
				[progressAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

function getProgressDataState(
	value: number | null,
	max: number
): "indeterminate" | "loaded" | "loading" {
	if (value === null) return "indeterminate";
	return value === max ? "loaded" : "loading";
}
