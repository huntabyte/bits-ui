import { useRefById } from "svelte-toolbelt";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";

const METER_ROOT_ATTR = "data-meter-root";

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

		useRefById(opts);
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
				[METER_ROOT_ATTR]: "",
			}) as const
	);
}

export function useMeterRootState(props: MeterRootStateProps) {
	return new MeterRootState(props);
}
