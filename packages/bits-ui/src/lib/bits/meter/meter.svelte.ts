import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import type { WithRefOpts } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const meterAttrs = createBitsAttrs({
	component: "meter",
	parts: ["root"],
});

type MeterRootStateProps = WithRefOpts<
	ReadableBoxedValues<{
		value: number;
		max: number;
		min: number;
	}>
>;

class MeterRootState {
	readonly opts: MeterRootStateProps;

	constructor(opts: MeterRootStateProps) {
		this.opts = opts;
	}

	props = $derived.by(
		() =>
			({
				role: "meter",
				value: this.opts.value.current,
				"aria-valuemin": this.opts.min.current,
				"aria-valuemax": this.opts.max.current,
				"aria-valuenow": this.opts.value.current,
				"data-value": this.opts.value.current,
				"data-max": this.opts.max.current,
				"data-min": this.opts.min.current,
				[meterAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export function useMeterRootState(props: MeterRootStateProps) {
	return new MeterRootState(props);
}
