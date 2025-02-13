import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import type { HTMLButtonAttributes } from "svelte/elements";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	OnChangeFn,
	WithRefProps,
} from "$lib/internal/types.js";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";

const CHECKBOX_ROOT_ATTR = "data-checkbox-root";
const CHECKBOX_GROUP_ATTR = "data-checkbox-group";
const CHECKBOX_GROUP_LABEL_ATTR = "data-checkbox-group-label";

type CheckboxGroupStateProps = WithRefProps<
	ReadableBoxedValues<{
		name: string | undefined;
		disabled: boolean;
		required: boolean;
		onValueChange: OnChangeFn<string[]>;
	}> &
		WritableBoxedValues<{
			value: string[];
		}>
>;

class CheckboxGroupState {
	labelId = $state<string | undefined>(undefined);

	constructor(readonly opts: CheckboxGroupStateProps) {
		useRefById(opts);
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.opts.value.current.includes(checkboxValue)) {
			this.opts.value.current.push(checkboxValue);
			this.opts.onValueChange.current(this.opts.value.current);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.opts.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		this.opts.value.current.splice(index, 1);
		this.opts.onValueChange.current(this.opts.value.current);
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				"aria-labelledby": this.labelId,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				[CHECKBOX_GROUP_ATTR]: "",
			}) as const
	);
}

type CheckboxGroupLabelStateProps = WithRefProps;

class CheckboxGroupLabelState {
	constructor(
		readonly opts: CheckboxGroupLabelStateProps,
		readonly group: CheckboxGroupState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				if (node) {
					group.labelId = node.id;
				} else {
					group.labelId = undefined;
				}
			},
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.group.opts.disabled.current),
				[CHECKBOX_GROUP_LABEL_ATTR]: "",
			}) as const
	);
}

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
	trueName = $derived.by(() => {
		if (this.group && this.group.opts.name.current) {
			return this.group.opts.name.current;
		} else {
			return this.opts.name.current;
		}
	});
	trueRequired = $derived.by(() => {
		if (this.group && this.group.opts.required.current) {
			return true;
		}
		return this.opts.required.current;
	});
	trueDisabled = $derived.by(() => {
		if (this.group && this.group.opts.disabled.current) {
			return true;
		}
		return this.opts.disabled.current;
	});

	constructor(
		readonly opts: CheckboxRootStateProps,
		readonly group: CheckboxGroupState | null = null
	) {
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		useRefById(opts);

		watch(
			[() => $state.snapshot(this.group?.opts.value.current), () => this.opts.value.current],
			([groupValue, value]) => {
				if (!groupValue || !value) return;
				this.opts.checked.current = groupValue.includes(value);
			}
		);

		watch(
			() => this.opts.checked.current,
			(checked) => {
				if (!this.group) return;
				if (checked) {
					this.group?.addValue(this.opts.value.current);
				} else {
					this.group?.removeValue(this.opts.value.current);
				}
			}
		);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.opts.disabled.current) return;
		if (e.key === kbd.ENTER) e.preventDefault();
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			this.#toggle();
		}
	}

	#toggle() {
		if (this.opts.indeterminate.current) {
			this.opts.indeterminate.current = false;
			this.opts.checked.current = true;
		} else {
			this.opts.checked.current = !this.opts.checked.current;
		}
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current) return;
		this.#toggle();
	}

	snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "checkbox",
				type: this.opts.type.current,
				disabled: this.trueDisabled,
				"aria-checked": getAriaChecked(
					this.opts.checked.current,
					this.opts.indeterminate.current
				),
				"aria-required": getAriaRequired(this.trueRequired),
				"data-disabled": getDataDisabled(this.trueDisabled),
				"data-state": getCheckboxDataState(
					this.opts.checked.current,
					this.opts.indeterminate.current
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
	trueChecked = $derived.by(() => {
		if (this.root.group) {
			if (
				this.root.opts.value.current !== undefined &&
				this.root.group.opts.value.current.includes(this.root.opts.value.current)
			) {
				return true;
			}
			return false;
		}
		return this.root.opts.checked.current;
	});

	shouldRender = $derived.by(() => Boolean(this.root.trueName));

	constructor(readonly root: CheckboxRootState) {}

	props = $derived.by(
		() =>
			({
				type: "checkbox",
				checked: this.root.opts.checked.current === true,
				disabled: this.root.trueDisabled,
				required: this.root.trueRequired,
				name: this.root.trueName,
				value: this.root.opts.value.current,
				"aria-hidden": "true",
				style: styleToString(srOnlyStyles),
			}) as const
	);
}

function getCheckboxDataState(checked: boolean, indeterminate: boolean) {
	if (indeterminate) return "indeterminate";
	return checked ? "checked" : "unchecked";
}

const CheckboxGroupContext = new Context<CheckboxGroupState>("Checkbox.Group");

const CheckboxRootContext = new Context<CheckboxRootState>("Checkbox.Root");

export function useCheckboxGroup(props: CheckboxGroupStateProps) {
	return CheckboxGroupContext.set(new CheckboxGroupState(props));
}

export function useCheckboxRoot(props: CheckboxRootStateProps) {
	return CheckboxRootContext.set(new CheckboxRootState(props, CheckboxGroupContext.getOr(null)));
}

export function useCheckboxGroupLabel(props: CheckboxGroupLabelStateProps) {
	return new CheckboxGroupLabelState(props, CheckboxGroupContext.get());
}

export function useCheckboxInput(): CheckboxInputState {
	return new CheckboxInputState(CheckboxRootContext.get());
}
