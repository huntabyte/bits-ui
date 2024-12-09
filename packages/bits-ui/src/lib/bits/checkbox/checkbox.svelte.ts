import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { createContext } from "$lib/internal/create-context.js";

const CHECKBOX_ROOT_ATTR = "data-checkbox-root";

type CheckboxRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		name: string | undefined;
		value: string | undefined;
		type: HTMLButtonAttributes["type"];
	}> &
		WritableBoxedValues<{
			checked: boolean;
			indeterminate: boolean;
		}>
>;

class CheckboxRootState {
	#id: CheckboxRootStateProps["id"];
	#ref: CheckboxRootStateProps["ref"];
	#type: CheckboxRootStateProps["type"];
	checked: CheckboxRootStateProps["checked"];
	disabled: CheckboxRootStateProps["disabled"];
	required: CheckboxRootStateProps["required"];
	name: CheckboxRootStateProps["name"];
	value: CheckboxRootStateProps["value"];
	indeterminate: CheckboxRootStateProps["indeterminate"];

	constructor(props: CheckboxRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
		this.#ref = props.ref;
		this.#id = props.id;
		this.indeterminate = props.indeterminate;
		this.#type = props.type;
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.disabled.current) return;
		if (e.key === kbd.ENTER) e.preventDefault();
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggle();
		}
	}

	#toggle() {
		if (this.indeterminate.current) {
			this.indeterminate.current = false;
			this.checked.current = true;
		} else {
			this.checked.current = !this.checked.current;
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.disabled.current) return;
		this.#toggle();
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "checkbox",
				type: this.#type.current,
				disabled: this.disabled.current,
				"aria-checked": getAriaChecked(this.checked.current, this.indeterminate.current),
				"aria-required": getAriaRequired(this.required.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-state": getCheckboxDataState(
					this.checked.current,
					this.indeterminate.current
				),
				[CHECKBOX_ROOT_ATTR]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
			}) as const
	);
}

//
// INPUT
//

class CheckboxInputState {
	root: CheckboxRootState;
	shouldRender = $derived.by(() => Boolean(this.root.name.current));

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				checked: this.root.checked.current === true,
				disabled: this.root.disabled.current,
				required: this.root.required.current,
				name: this.root.name.current,
				value: this.root.value.current,
				"aria-hidden": "true",
				style: styleToString(srOnlyStyles),
			}) as const
	);
}

//
// HELPERS
//

function getCheckboxDataState(checked: boolean, indeterminate: boolean) {
	if (indeterminate) {
		return "indeterminate";
	}
	return checked ? "checked" : "unchecked";
}

//
// CONTEXT METHODS
//

const [setCheckboxRootContext, getCheckboxRootContext] =
	createContext<CheckboxRootState>("Checkbox.Root");

export function useCheckboxRoot(props: CheckboxRootStateProps) {
	return setCheckboxRootContext(new CheckboxRootState(props));
}

export function useCheckboxInput(): CheckboxInputState {
	const root = getCheckboxRootContext();
	return new CheckboxInputState(root);
}
