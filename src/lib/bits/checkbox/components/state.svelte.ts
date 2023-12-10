import type { OnChangeFn } from "$lib/internal";
import { getContext, setContext } from "svelte";
import { removeUndefined } from "../../../internal/object";

export type CheckboxStateProps = {
	checked: boolean | "indeterminate";
	disabled: boolean;
	onCheckedChange: OnChangeFn<boolean | "indeterminate"> | undefined;
	required: boolean;
};

const defaultCheckboxStateProps = {
	checked: false,
	disabled: false,
	onCheckedChange: undefined,
	required: false
} satisfies CheckboxStateProps;

export class CheckboxState {
	checked: CheckboxStateProps["checked"] = $state(false);
	disabled: CheckboxStateProps["disabled"] = $state(false);
	onCheckedChange: CheckboxStateProps["onCheckedChange"] = $state(undefined);
	required: CheckboxStateProps["required"] = $state(false);
	attrs: Record<string, unknown> = $state({});

	constructor(props: Partial<CheckboxStateProps> = {}) {
		const mergedProps = {
			...defaultCheckboxStateProps,
			...removeUndefined(props)
		} satisfies CheckboxStateProps;
		this.checked = mergedProps.checked;
		this.disabled = mergedProps.disabled;
		this.onCheckedChange = mergedProps.onCheckedChange;
		this.required = mergedProps.required;

		$effect(() => {
			this.onCheckedChange?.(this.checked);
		});

		$effect(() => {
			this.attrs = {
				"data-disabled": this.disabled ? "" : undefined,
				"data-state":
					this.checked === "indeterminate"
						? "indeterminate"
						: this.checked
						  ? "checked"
						  : "unchecked",
				type: "button",
				role: "checkbox",
				"aria-checked": this.checked === "indeterminate" ? "mixed" : this.checked,
				"aria-required": this.required
			};
		});
	}

	createIndicator() {
		return new CheckboxIndicator(this);
	}

	createInput() {
		return new CheckboxInput(this);
	}
}

class CheckboxIndicator {
	rootState: CheckboxState;
	isChecked: boolean = $state(false);
	isIndeterminate: boolean = $state(false);
	attrs: Record<string, unknown> = $state({});

	constructor(rootState: CheckboxState) {
		this.rootState = rootState;

		$effect(() => {
			this.isChecked = this.rootState.checked === true;
			this.isIndeterminate = this.rootState.checked === "indeterminate";
		});

		$effect(() => {
			this.attrs = {
				"data-state": this.isChecked
					? "checked"
					: this.isIndeterminate
					  ? "indeterminate"
					  : "unchecked",
				"data-checkbox-indicator": ""
			};
		});
	}
}

class CheckboxInput {
	rootState: CheckboxState;
	attrs: Record<string, unknown> = $state({});

	constructor(rootState: CheckboxState) {
		this.rootState = rootState;

		$effect(() => {
			this.attrs = {
				"data-checkbox-input": "",
				checked: this.rootState.checked === true,
				disabled: this.rootState.disabled
			};
		});
	}

	get required() {
		return this.rootState.required;
	}
}

/**
 * CONTEXT METHODS
 */

const CHECKBOX_ROOT_CONTEXT = "CHECKBOX_ROOT_CONTEXT";

export function setCheckboxRootContext(ctx: CheckboxState) {
	setContext(CHECKBOX_ROOT_CONTEXT, ctx);
}

export function getCheckboxRootContext(): CheckboxState {
	return getContext(CHECKBOX_ROOT_CONTEXT);
}
