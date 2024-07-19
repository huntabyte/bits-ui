import { getAriaPressed, getDataDisabled, getDisabled } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { kbd } from "$lib/internal/kbd.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";

const ROOT_ATTR = "data-toggle-root";

type ToggleRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}> &
		WritableBoxedValues<{
			pressed: boolean;
		}>
>;

class ToggleRootState {
	#id: ToggleRootStateProps["id"];
	#ref: ToggleRootStateProps["ref"];
	#disabled: ToggleRootStateProps["disabled"];
	pressed: ToggleRootStateProps["pressed"];

	constructor(props: ToggleRootStateProps) {
		this.#disabled = props.disabled;
		this.pressed = props.pressed;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
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

	props = $derived.by(
		() =>
			({
				[ROOT_ATTR]: "",
				"data-disabled": getDataDisabled(this.#disabled.value),
				"aria-pressed": getAriaPressed(this.pressed.value),
				"data-state": getToggleDataState(this.pressed.value),
				disabled: getDisabled(this.#disabled.value),
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

//
// METHODS
//

export function useToggleRoot(props: ToggleRootStateProps) {
	return new ToggleRootState(props);
}

//
// HELPERS
//

export function getToggleDataState(condition: boolean): "on" | "off" {
	return condition ? "on" : "off";
}
