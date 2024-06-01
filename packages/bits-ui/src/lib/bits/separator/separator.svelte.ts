import { getAriaHidden, getAriaOrientation, getDataOrientation } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

const ROOT_ATTR = "data-separator-root";

type SeparatorRootStateProps = ReadableBoxedValues<{
	orientation: Orientation;
	decorative: boolean;
}>;

class SeparatorRootState {
	#orientation: SeparatorRootStateProps["orientation"];
	#decorative: SeparatorRootStateProps["decorative"];

	constructor(props: SeparatorRootStateProps) {
		this.#orientation = props.orientation;
		this.#decorative = props.decorative;
	}

	props = $derived.by(
		() =>
			({
				role: this.#decorative.value ? "none" : "separator",
				"aria-orientation": getAriaOrientation(this.#orientation.value),
				"aria-hidden": getAriaHidden(this.#decorative.value),
				"data-orientation": getDataOrientation(this.#orientation.value),
				[ROOT_ATTR]: "",
			}) as const
	);
}

export function useSeparatorRoot(props: SeparatorRootStateProps) {
	return new SeparatorRootState(props);
}
