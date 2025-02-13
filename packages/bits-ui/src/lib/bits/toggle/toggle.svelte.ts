import { useRefById } from "svelte-toolbelt";
import { getAriaPressed, getDataDisabled, getDisabled } from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";

const TOGGLE_ROOT_ATTR = "data-toggle-root";

type ToggleRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
	}> &
		WritableBoxedValues<{
			pressed: boolean;
		}>
>;

class ToggleRootState {
	constructor(readonly opts: ToggleRootStateProps) {
		useRefById(opts);

		this.onclick = this.onclick.bind(this);
	}

	#togglePressed() {
		if (!this.opts.disabled.current) {
			this.opts.pressed.current = !this.opts.pressed.current;
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		this.#togglePressed();
	}

	snippetProps = $derived.by(() => ({
		pressed: this.opts.pressed.current,
	}));

	props = $derived.by(
		() =>
			({
				[TOGGLE_ROOT_ATTR]: "",
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"aria-pressed": getAriaPressed(this.opts.pressed.current),
				"data-state": getToggleDataState(this.opts.pressed.current),
				disabled: getDisabled(this.opts.disabled.current),
				onclick: this.onclick,
			}) as const
	);
}

export function useToggleRoot(props: ToggleRootStateProps) {
	return new ToggleRootState(props);
}

export function getToggleDataState(condition: boolean): "on" | "off" {
	return condition ? "on" : "off";
}
