/**
 * ROOT
 */

import { getContext, setContext } from "svelte";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import { type Box, type ReadonlyBox, boxWithState, readonlyBox } from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { kbd } from "$lib/internal/kbd.js";

type CheckboxRootStateProps = {
	checked: Box<boolean | "indeterminate">;
	disabled: ReadonlyBox<boolean>;
	required: ReadonlyBox<boolean>;
	name: ReadonlyBox<string | undefined>;
	value: ReadonlyBox<string | undefined>;
	onclick: ReadonlyBox<EventCallback<MouseEvent>>;
	onkeydown: ReadonlyBox<EventCallback<KeyboardEvent>>;
};

function getCheckboxDataState(checked: boolean | "indeterminate") {
	if (checked === "indeterminate") {
		return "indeterminate";
	}
	return checked ? "checked" : "unchecked";
}

class CheckboxRootState {
	checked: Box<boolean | "indeterminate"> = undefined as unknown as Box<
		boolean | "indeterminate"
	>;
	disabled: ReadonlyBox<boolean> = undefined as unknown as ReadonlyBox<boolean>;
	required: ReadonlyBox<boolean> = undefined as unknown as ReadonlyBox<boolean>;
	name: ReadonlyBox<string | undefined> = undefined as unknown as ReadonlyBox<string | undefined>;
	value: ReadonlyBox<string | undefined> = undefined as unknown as ReadonlyBox<
		string | undefined
	>;
	onclickProp = boxWithState<CheckboxRootStateProps["onclick"]>(readonlyBox(() => () => {}));
	onkeydownProp = boxWithState<CheckboxRootStateProps["onkeydown"]>(readonlyBox(() => () => {}));
	#attrs = $derived({
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-state": getCheckboxDataState(this.checked.value),
		role: "checkbox",
		type: "button",
		"aria-checked": getAriaChecked(this.checked.value),
		"aria-required": getAriaRequired(this.required.value),
		"data-checkbox-root": "",
		disabled: this.disabled.value,
	} as const);

	constructor(props: CheckboxRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.onclickProp.value = props.onclick;
		this.onkeydownProp.value = props.onkeydown;
	}

	onkeydown = composeHandlers(this.onkeydownProp, (e) => {
		if (e.key === kbd.ENTER) e.preventDefault();
	});

	onclick = composeHandlers(this.onclickProp, () => {
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
			...this.#attrs,
			onclick: this.onclick,
			onkeydown: this.onkeydown,
		};
	}
}

/**
 * INDICATOR
 */

class CheckboxIndicatorState {
	root = undefined as unknown as CheckboxRootState;
	#attrs = $derived({
		"data-disabled": getDataDisabled(this.root.disabled.value),
		"data-state": getCheckboxDataState(this.root.checked.value),
		"data-checkbox-indicator": "",
	});

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	get props() {
		return this.#attrs;
	}
}

/**
 * INPUT
 */

class CheckboxInputState {
	root = undefined as unknown as CheckboxRootState;
	#attrs = $derived({
		type: "checkbox",
		checked: this.root.checked.value === true,
		disabled: this.root.disabled.value,
		required: this.root.required.value,
		name: this.root.name.value,
		value: this.root.value.value,
		"data-checkbox-input": "",
	});
	shouldRender = $derived(this.root.name.value !== undefined);

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	get props() {
		return this.#attrs;
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
