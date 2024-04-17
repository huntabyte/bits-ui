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
	checked: Box<boolean | "indeterminate">;
	disabled: ReadonlyBox<boolean>;
	required: ReadonlyBox<boolean>;
	name: ReadonlyBox<string | undefined>;
	value: ReadonlyBox<string | undefined>;
	#onclickProp = boxedState<CheckboxRootStateProps["onclick"]>(readonlyBox(() => () => {}));
	#onkeydownProp = boxedState<CheckboxRootStateProps["onkeydown"]>(readonlyBox(() => () => {}));

	constructor(props: CheckboxRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.#onclickProp.value = props.onclick;
		this.#onkeydownProp.value = props.onkeydown;
	}

	#onkeydown = composeHandlers(this.#onkeydownProp, (e) => {
		if (e.key === kbd.ENTER) e.preventDefault();
	});

	#onclick = composeHandlers(this.#onclickProp, () => {
		if (this.disabled.value) return;
		if (this.checked.value === "indeterminate") {
			this.checked.value = true;
			return;
		}
		this.checked.value = !this.checked.value;
	});

	createIndicator() {
		return new CheckboxIndicatorState(this);
	}

	createInput() {
		return new CheckboxInputState(this);
	}

	get props() {
		return {
			"data-disabled": getDataDisabled(this.disabled.value),
			"data-state": getCheckboxDataState(this.checked.value),
			role: "checkbox",
			type: "button",
			"aria-checked": getAriaChecked(this.checked.value),
			"aria-required": getAriaRequired(this.required.value),
			"data-checkbox-root": "",
			disabled: this.disabled.value,
			//
			onclick: this.#onclick,
			onkeydown: this.#onkeydown,
		} as const;
	}
}

/**
 * INDICATOR
 */

class CheckboxIndicatorState {
	root: CheckboxRootState;

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	get props() {
		return {
			"data-disabled": getDataDisabled(this.root.disabled.value),
			"data-state": getCheckboxDataState(this.root.checked.value),
			"data-checkbox-indicator": "",
		} as const;
	}
}

/**
 * INPUT
 */

class CheckboxInputState {
	root: CheckboxRootState;

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	get shouldRender() {
		return this.root.name.value !== undefined;
	}

	get props() {
		return {
			type: "checkbox",
			checked: this.root.checked.value === true,
			disabled: this.root.disabled.value,
			required: this.root.required.value,
			name: this.root.name.value,
			value: this.root.value.value,
			"data-checkbox-input": "",
		} as const;
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

export function getCheckboxIndicatorState(): CheckboxIndicatorState {
	return getCheckboxRootState().createIndicator();
}

export function getCheckboxInputState(): CheckboxInputState {
	return getCheckboxRootState().createInput();
}
