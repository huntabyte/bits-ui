import { attachRef } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const meterAttrs = createBitsAttrs({
	component: "meter",
	parts: ["root"],
});

type MeterRootStateProps = WithRefProps<
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
