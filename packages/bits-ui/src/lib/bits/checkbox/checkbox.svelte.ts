/**
 * ROOT
 */

import { getContext, setContext } from "svelte";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	boxedState,
	readonlyBox,
} from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { kbd } from "$lib/internal/kbd.js";

type CheckboxRootStateProps = ReadonlyBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string | undefined;
	value: string | undefined;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}> &
	BoxedValues<{
		checked: boolean | "indeterminate";
	}>;

function getCheckboxDataState(checked: boolean | "indeterminate") {
	if (checked === "indeterminate") {
		return "indeterminate";
	}
	return checked ? "checked" : "unchecked";
}

class CheckboxRootState {
	checked = undefined as unknown as Box<boolean | "indeterminate">;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	required = undefined as unknown as ReadonlyBox<boolean>;
	name: ReadonlyBox<string | undefined>;
	value: ReadonlyBox<string | undefined>;
	#composedClick = undefined as unknown as EventCallback<MouseEvent>;
	#composedKeydown = undefined as unknown as EventCallback<KeyboardEvent>;
	props = $derived({
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-state": getCheckboxDataState(this.checked.value),
		role: "checkbox",
		type: "button",
		"aria-checked": getAriaChecked(this.checked.value),
		"aria-required": getAriaRequired(this.required.value),
		"data-checkbox-root": "",
		disabled: this.disabled.value,
		//
		onclick: this.#composedClick,
		onkeydown: this.#composedKeydown,
	} as const);
	indicatorprops = $derived({
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-state": getCheckboxDataState(this.checked.value),
		"data-checkbox-indicator": "",
	} as const);

	constructor(props: CheckboxRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key === kbd.ENTER) e.preventDefault();
	};

	#onclick = () => {
		if (this.disabled.value) return;
		if (this.checked.value === "indeterminate") {
			this.checked.value = true;
			return;
		}
		this.checked.value = !this.checked.value;
	};

	createInput() {
		return new CheckboxInputState(this);
	}
}

/**
 * INPUT
 */

class CheckboxInputState {
	root = undefined as unknown as CheckboxRootState;
	props = $derived({
		type: "checkbox",
		checked: this.root.checked.value === true,
		disabled: this.root.disabled.value,
		required: this.root.required.value,
		name: this.root.name.value,
		value: this.root.value.value,
		"data-checkbox-input": "",
	} as const);
	shouldRender = $derived(this.root.name.value !== undefined);

	constructor(root: CheckboxRootState) {
		this.root = root;
	}
}

/**
 * CONTEXT METHODS
 */

export const CHECKBOX_ROOT_KEY = Symbol("Checkbox.Root");

export function setCheckboxRootState(props: CheckboxRootStateProps) {
	return setContext(CHECKBOX_ROOT_KEY, new CheckboxRootState(props));
}

export function getCheckboxRootState(): CheckboxRootState {
	return getContext(CHECKBOX_ROOT_KEY);
}

export function getCheckboxInputState(): CheckboxInputState {
	return getCheckboxRootState().createInput();
}
