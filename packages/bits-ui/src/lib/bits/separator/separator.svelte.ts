import { useRefById } from "svelte-toolbelt";
import { getAriaHidden, getAriaOrientation, getDataOrientation } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import type { Orientation } from "$lib/shared/index.js";

const SEPARATOR_ROOT_ATTR = "data-separator-root";

type SeparatorRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		orientation: Orientation;
		decorative: boolean;
	}>
>;

class SeparatorRootState {
	readonly opts: SeparatorRootStateProps;

	constructor(opts: SeparatorRootStateProps) {
		this.opts = opts;

		useRefById(opts);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: this.opts.decorative.current ? "none" : "separator",
				"aria-orientation": getAriaOrientation(this.opts.orientation.current),
				"aria-hidden": getAriaHidden(this.opts.decorative.current),
				"data-orientation": getDataOrientation(this.opts.orientation.current),
				[SEPARATOR_ROOT_ATTR]: "",
			}) as const
	);
}

export function useSeparatorRoot(props: SeparatorRootStateProps) {
	return new SeparatorRootState(props);
}
