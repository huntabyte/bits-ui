import { getAriaHidden, getAriaOrientation, getDataOrientation } from "$lib/internal/attrs.js";
import type { ReadonlyBox, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import type { Orientation } from "$lib/shared/index.js";

type SeparatorRootStateProps = ReadonlyBoxedValues<{
	orientation: Orientation;
	decorative: boolean;
}>;

class SeparatorRootState {
	#orientation: ReadonlyBox<Orientation>;
	#decorative: ReadonlyBox<boolean>;

	constructor(props: SeparatorRootStateProps) {
		this.#orientation = props.orientation;
		this.#decorative = props.decorative;
	}

	get props() {
		return {
			role: this.#decorative.value ? "none" : "separator",
			"aria-orientation": getAriaOrientation(this.#orientation.value),
			"aria-hidden": getAriaHidden(this.#decorative.value),
			"data-orientation": getDataOrientation(this.#orientation.value),
			"data-bits-separator-root": "",
		};
	}
}

export function setSeparatorRootState(props: SeparatorRootStateProps) {
	return new SeparatorRootState(props);
}
