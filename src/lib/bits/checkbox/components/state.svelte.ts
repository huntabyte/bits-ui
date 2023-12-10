import type { EventCallback, OnChangeFn } from "$lib/internal";
import { composeHandlers, hiddenInputStyles, kbd, mergeProps } from "$lib/internal";
import { getContext, setContext } from "svelte";
import type { CheckboxPropsWithoutHTML } from "./types";

/**
 * The parameters used to initialize the root state of the checkbox.
 */
interface CheckboxStateParams extends Required<Omit<CheckboxPropsWithoutHTML, "onCheckedChange">> {
	onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}

const defaultCheckboxState = {
	checked: "indeterminate",
	defaultChecked: false,
	disabled: false,
	onCheckedChange: undefined,
	required: false,
	onclick: undefined,
	onkeydown: undefined
} satisfies CheckboxStateParams;

export class CheckboxState {
	checked: CheckboxStateParams["checked"] = $state("indeterminate");
	disabled: CheckboxStateParams["disabled"] = $state(false);
	required: CheckboxStateParams["required"] = $state(false);
	onCheckedChange: CheckboxStateParams["onCheckedChange"] = $state(() => {});
	rootAttrs: Record<string, unknown> = $derived({
		"data-disabled": getDataDisabled(this.disabled),
		"data-state": getCheckboxDataState(this.checked),
		"aria-checked": getCheckboxAriaChecked(this.checked),
		"aria-required": this.required,
		type: "button",
		role: "checkbox",
		"data-checkbox-root": ""
	});
	isChecked = $derived(this.checked === true);
	isIndeterminate = $derived(this.checked === "indeterminate");
	propOnKeydown: CheckboxStateParams["onkeydown"] = $state(() => {});
	propOnClick: CheckboxStateParams["onclick"] = $state(() => {});

	indicatorAttrs = $derived({
		"data-state": getCheckboxDataState(this.checked),
		"data-checkbox-indicator": ""
	});

	inputAttrs = $derived({
		checked: this.checked === true,
		disabled: this.disabled,
		style: hiddenInputStyles,
		"data-checkbox-input": ""
	});

	constructor(init: Partial<CheckboxStateParams> = {}) {
		const { disabled, required, checked, onclick, onkeydown, onCheckedChange } = mergeProps(
			defaultCheckboxState,
			init
		) satisfies CheckboxStateParams;

		this.disabled = disabled;
		this.checked = checked;
		this.required = required;
		this.propOnKeydown = onkeydown;
		this.propOnClick = onclick;
		this.onCheckedChange = onCheckedChange;

		$effect(() => {
			this.onCheckedChange?.(this.checked);
		});
	}

	onkeydown = composeHandlers<KeyboardEvent>(this.propOnKeydown, (e) => {
		// Checkboxes don't active on 'Enter' keydown
		if (e.key === kbd.ENTER) e.preventDefault();
	});

	onclick = composeHandlers<MouseEvent>(this.propOnClick, () => {
		if (this.disabled) return;

		if (this.checked === "indeterminate") {
			this.checked = true;
		} else {
			this.checked = !this.checked;
		}
	});
}

/**
 * CONTEXT METHODS
 */

const CHECKBOX_ROOT_CONTEXT = "CHECKBOX_ROOT_CONTEXT";

export function initCheckboxState(props: Partial<CheckboxStateParams>) {
	const state = new CheckboxState(props);
	setContext(CHECKBOX_ROOT_CONTEXT, state);
	return state;
}

export function getCheckboxState(): CheckboxState {
	return getContext(CHECKBOX_ROOT_CONTEXT);
}

/**
 * HELPERS
 */

function getCheckboxDataState(checked: boolean | "indeterminate") {
	if (checked === "indeterminate") return "indeterminate";
	if (checked) return "checked";
	return "unchecked";
}

function getCheckboxAriaChecked(checked: boolean | "indeterminate") {
	if (checked === "indeterminate") return "mixed";
	if (checked) return "true";
	return "false";
}

function getDataDisabled(disabled: boolean) {
	return disabled ? "" : undefined;
}
