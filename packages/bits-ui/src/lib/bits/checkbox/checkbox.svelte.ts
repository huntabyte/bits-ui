/**
 * ROOT
 */

import { getContext, setContext } from "svelte";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import { type Box, type BoxedValues, box } from "$lib/internal/box.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { kbd } from "$lib/internal/kbd.js";

type CheckboxRootStateProps = BoxedValues<{
	checked: boolean | "indeterminate";
	disabled: boolean;
	required: boolean;
	name: string | undefined;
	value: string | undefined;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

function getCheckboxDataState(checked: boolean | "indeterminate") {
	if (checked === "indeterminate") {
		return "indeterminate";
	}
	return checked ? "checked" : "unchecked";
}

class CheckboxRootState {
	checked = box<boolean | "indeterminate">(() => false);
	disabled = box(() => false);
	required = box(() => false);
	name = box<string | undefined>(() => undefined);
	value = box<string | undefined>(() => undefined);
	onclickProp = box(() => {}) as unknown as Box<EventCallback<MouseEvent> | undefined>;
	onkeydownProp = box(() => {}) as unknown as Box<EventCallback<KeyboardEvent> | undefined>;
	#attrs = $derived({
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-state": getCheckboxDataState(this.checked.value),
		type: "button",
		role: "checkbox",
		"aria-checked": getAriaChecked(this.checked.value),
		"aria-required": getAriaRequired(this.required.value),
		"data-checkbox-root": "",
	} as const);

	constructor(props: CheckboxRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.onclickProp = props.onclick ?? this.onclickProp;
		this.onkeydownProp = props.onkeydown ?? this.onkeydownProp;
	}

	onkeydown = composeHandlers(this.onkeydownProp.value, (e) => {
		if (e.key === kbd.ENTER) e.preventDefault();
	});

	onclick = composeHandlers(this.onclickProp.value, () => {
		if (this.disabled.value) return;
		if (this.checked.value === "indeterminate") return true;
		return !this.checked.value;
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
