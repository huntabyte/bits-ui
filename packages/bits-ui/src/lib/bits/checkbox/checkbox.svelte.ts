import {
	type Box,
	type BoxedValues,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
	kbd,
} from "$lib/internal/index.js";
import { createContext } from "$lib/internal/createContext.js";

type CheckboxRootStateProps = ReadonlyBoxedValues<{
	disabled: boolean;
	required: boolean;
	name: string | undefined;
	value: string | undefined;
}> &
	BoxedValues<{
		checked: boolean | "indeterminate";
	}>;

class CheckboxRootState {
	checked = undefined as unknown as Box<boolean | "indeterminate">;
	disabled = undefined as unknown as ReadonlyBox<boolean>;
	required = undefined as unknown as ReadonlyBox<boolean>;
	name: ReadonlyBox<string | undefined>;
	value: ReadonlyBox<string | undefined>;

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
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
	} as const);
}

//
// INPUT
//

class CheckboxInputState {
	root = undefined as unknown as CheckboxRootState;
	shouldRender = $derived(this.root.name.value !== undefined);

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	props = $derived({
		type: "checkbox",
		checked: this.root.checked.value === true,
		disabled: this.root.disabled.value,
		required: this.root.required.value,
		name: this.root.name.value,
		value: this.root.value.value,
		"data-checkbox-input": "",
	} as const);
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
