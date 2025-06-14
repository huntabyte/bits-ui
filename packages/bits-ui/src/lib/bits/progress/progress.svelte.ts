import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import { createBitsAttrs } from "$lib/internal/attrs.js";
import type { WithRefOpts } from "$lib/internal/types.js";

const progressAttrs = createBitsAttrs({
	component: "progress",
	parts: ["root"],
});

type ProgressRootStateProps = WithRefOpts<
	ReadableBoxedValues<{
		value: number | null;
		max: number;
		min: number;
	}>
>;

class ProgressRootState {
	readonly opts: ProgressRootStateProps;

	constructor(opts: ProgressRootStateProps) {
		this.opts = opts;
	}

	props = $derived.by(
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
				...attachRef(this.opts.ref),
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

export function useProgressRootState(props: ProgressRootStateProps) {
	return new ProgressRootState(props);
}
