import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import type { RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const meterAttrs = createBitsAttrs({
	component: "meter",
	parts: ["root"],
});

interface MeterRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			value: number;
			max: number;
			min: number;
		}> {}

export class MeterRootState {
	static create(opts: MeterRootStateOpts) {
		return new MeterRootState(opts);
	}

	readonly opts: MeterRootStateOpts;
	readonly attachment: RefAttachment;

	constructor(opts: MeterRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly props = $derived.by(
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
				...this.attachment,
			}) as const
	);
}
