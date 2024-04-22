import {
	getAriaPressed,
	getAttrAndSelector,
	getDataDisabled,
	getDisabledAttr,
} from "$lib/internal/attrs.js";
import type { BoxedValues, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";

const [ROOT_ATTR] = getAttrAndSelector("toggle-root");

type ToggleRootStateProps = ReadonlyBoxedValues<{
	disabled: boolean;
}> &
	BoxedValues<{
		pressed: boolean;
	}>;

class ToggleRootState {
	#disabled = undefined as unknown as ToggleRootStateProps["disabled"];
	pressed = undefined as unknown as ToggleRootStateProps["pressed"];

	constructor(props: ToggleRootStateProps) {
		this.#disabled = props.disabled;
		this.pressed = props.pressed;
	}

	#togglePressed() {
		if (!this.#disabled.value) {
			this.pressed.value = !this.pressed.value;
		}
	}

	#onclick = () => {
		this.#togglePressed();
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.ENTER || e.key !== kbd.SPACE) return;
		e.preventDefault();
		this.#togglePressed();
	};

	props = $derived({
		[ROOT_ATTR]: "",
		"data-disabled": getDataDisabled(this.#disabled.value),
		"aria-pressed": getAriaPressed(this.pressed.value),
		"data-state": getToggleDataState(this.pressed.value),
		disabled: getDisabledAttr(this.#disabled.value),
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

//
// METHODS
//

export function setToggleRootState(props: ToggleRootStateProps) {
	return new ToggleRootState(props);
}

//
// HELPERS
//

export function getToggleDataState(condition: boolean): "on" | "off" {
	return condition ? "on" : "off";
}
