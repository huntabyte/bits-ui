import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import {
	createBitsAttrs,
	getAriaHidden,
	getAriaOrientation,
	getDataOrientation,
} from "$lib/internal/attrs.js";
import type { WithRefOpts } from "$lib/internal/types.js";
import type { Orientation } from "$lib/shared/index.js";

const separatorAttrs = createBitsAttrs({
	component: "separator",
	parts: ["root"],
});

type SeparatorRootStateProps = WithRefOpts<
	ReadableBoxedValues<{
		orientation: Orientation;
		decorative: boolean;
	}>
>;

class SeparatorRootState {
	readonly opts: SeparatorRootStateProps;

	constructor(opts: SeparatorRootStateProps) {
		this.opts = opts;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.opts.decorative.current ? "none" : "separator",
				"aria-orientation": getAriaOrientation(this.opts.orientation.current),
				"aria-hidden": getAriaHidden(this.opts.decorative.current),
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				[separatorAttrs.root]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export function useSeparatorRoot(props: SeparatorRootStateProps) {
	return new SeparatorRootState(props);
}
