import { getContext, setContext } from "svelte";
import {
	getAriaChecked,
	getAriaRequired,
	getDataChecked,
	getDataDisabled,
	getDataRequired,
} from "$lib/internal/attrs.js";
import type { BoxedValues, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { kbd } from "$lib/internal/kbd.js";

type SwitchRootStateProps = ReadonlyBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string | undefined;
	value: string;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}> &
	BoxedValues<{
		checked: boolean;
	}>;

class SwitchRootState {
	checked: SwitchRootStateProps["checked"];
	disabled: SwitchRootStateProps["disabled"];
	required: SwitchRootStateProps["required"];
	name: SwitchRootStateProps["name"];
	value: SwitchRootStateProps["value"];
	#composedClick: EventCallback<MouseEvent>;
	#composedKeydown: EventCallback<KeyboardEvent>;

	constructor(props: SwitchRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);
	}

	#toggle() {
		this.checked.value = !this.checked.value;
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (!(e.key === kbd.ENTER || e.key === kbd.SPACE) || this.disabled.value) return;
		e.preventDefault();
		this.#toggle();
	};

	#onclick = () => {
		if (this.disabled.value) return;
		this.#toggle();
	};

	get props() {
		return {
			"data-disabled": getDataDisabled(this.disabled.value),
			"data-state": getDataChecked(this.checked.value),
			"data-required": getDataRequired(this.required.value),
			type: "button",
			role: "switch",
			"aria-checked": getAriaChecked(this.checked.value),
			"aria-required": getAriaRequired(this.required.value),
			"data-switch-root": "",
			//
			onclick: this.#composedClick,
			onkeydown: this.#composedKeydown,
		} as const;
	}

	createInput() {
		return new SwitchInputState(this);
	}

	createThumb() {
		return new SwitchThumbState(this);
	}
}

class SwitchInputState {
	#root: SwitchRootState;

	constructor(root: SwitchRootState) {
		this.#root = root;
	}

	get shouldRender() {
		return this.#root.name.value !== undefined;
	}

	get props() {
		return {
			type: "checkbox",
			name: this.#root.name.value,
			value: this.#root.value.value,
			checked: this.#root.checked.value,
			disabled: this.#root.disabled.value,
			required: this.#root.required.value,
		} as const;
	}
}

class SwitchThumbState {
	root: SwitchRootState;

	constructor(root: SwitchRootState) {
		this.root = root;
	}

	get props() {
		return {
			"data-disabled": getDataDisabled(this.root.disabled.value),
			"data-state": getDataChecked(this.root.checked.value),
			"data-required": getDataRequired(this.root.required.value),
			"data-switch-thumb": "",
		} as const;
	}
}

//
// CONTEXT METHODS
//

const SWITCH_ROOT_KEY = Symbol("Switch.Root");

export function setSwitchRootState(props: SwitchRootStateProps) {
	return setContext(SWITCH_ROOT_KEY, new SwitchRootState(props));
}

export function getSwitchRootState(): SwitchRootState {
	return getContext(SWITCH_ROOT_KEY);
}

export function getSwitchInputState(): SwitchInputState {
	return getSwitchRootState().createInput();
}

export function getSwitchThumbState(): SwitchThumbState {
	return getSwitchRootState().createThumb();
}
