import {
	type ReadableBoxedValues,
	type WritableBoxedValues,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
	kbd,
} from "$lib/internal/index.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "data-checkbox-root";

type CheckboxRootStateProps = ReadableBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string | undefined;
	value: string | undefined;
}> &
	WritableBoxedValues<{
		checked: boolean | "indeterminate";
	}>;

class CheckboxRootState {
	checked: CheckboxRootStateProps["checked"];
	disabled: CheckboxRootStateProps["disabled"];
	required: CheckboxRootStateProps["required"];
	name: CheckboxRootStateProps["name"];
	value: CheckboxRootStateProps["value"];

	constructor(props: CheckboxRootStateProps) {
		this.checked = props.checked;
		this.disabled = props.disabled;
		this.required = props.required;
		this.name = props.name;
		this.value = props.value;
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

	props = $derived.by(
		() =>
			({
				"data-disabled": getDataDisabled(this.disabled.value),
				"data-state": getCheckboxDataState(this.checked.value),
				role: "checkbox",
				type: "button",
				"aria-checked": getAriaChecked(this.checked.value),
				"aria-required": getAriaRequired(this.required.value),
				disabled: this.disabled.value,
				[ROOT_ATTR]: "",
				//
				onclick: this.#onclick,
				onkeydown: this.#onkeydown,
			}) as const
	);
}

//
// INPUT
//

class CheckboxInputState {
	root: CheckboxRootState;
	shouldRender = $derived.by(() => this.root.name.value !== undefined);

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				checked: this.root.checked.value === true,
				disabled: this.root.disabled.value,
				required: this.root.required.value,
				name: this.root.name.value,
				value: this.root.value.value,
				"data-checkbox-input": "",
			}) as const
	);
}

//
// HELPERS
//

function getCheckboxDataState(checked: boolean | "indeterminate") {
	if (checked === "indeterminate") {
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
	return getCheckboxRootContext().createInput();
}
