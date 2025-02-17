import { useRefById } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";

const ROOT_ATTR = "data-progress-root";

type ProgressRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		value: number | null;
		max: number;
		min: number;
	}>
>;

class ProgressRootState {
	constructor(readonly opts: ProgressRootStateProps) {
		useRefById(opts);
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
				[ROOT_ATTR]: "",
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
