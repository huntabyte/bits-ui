import { getAriaHidden, getAriaOrientation, getDataOrientation } from "$lib/internal/attrs.js";
import type { ReadonlyBox, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

type SeparatorRootStateProps = ReadonlyBoxedValues<{
	orientation: Orientation;
	decorative: boolean;
}>;

class SeparatorRootState {
	#orientation = undefined as unknown as ReadonlyBox<Orientation>;
	#decorative = undefined as unknown as ReadonlyBox<boolean>;
	props = $derived({
		role: this.#decorative.value ? "none" : "separator",
		"aria-orientation": getAriaOrientation(this.#orientation.value),
		"aria-hidden": getAriaHidden(this.#decorative.value),
		"data-orientation": getDataOrientation(this.#orientation.value),
		"data-bits-separator-root": "",
	} as const);

	constructor(props: SeparatorRootStateProps) {
		this.#orientation = props.orientation;
		this.#decorative = props.decorative;
	}
}

export function useSeparatorRoot(props: SeparatorRootStateProps) {
	return new SeparatorRootState(props);
}
