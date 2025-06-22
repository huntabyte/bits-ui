import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from "svelte-toolbelt";
import type { HTMLButtonAttributes } from "svelte/elements";
import { Context, watch } from "runed";
import type {
	BitsKeyboardEvent,
	BitsMouseEvent,
	OnChangeFn,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import {
	createBitsAttrs,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
} from "$lib/internal/attrs.js";
import { kbd } from "$lib/internal/kbd.js";
import { arraysAreEqual } from "$lib/internal/arrays.js";

const checkboxAttrs = createBitsAttrs({
	component: "checkbox",
	parts: ["root", "group", "group-label", "input"],
});

interface CheckboxGroupStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			name: string | undefined;
			disabled: boolean;
			required: boolean;
			onValueChange: OnChangeFn<string[]>;
		}>,
		WritableBoxedValues<{
			value: string[];
		}> {}

export const CheckboxGroupContext = new Context<CheckboxGroupState>("Checkbox.Group");

export class CheckboxGroupState {
	static create(opts: CheckboxGroupStateOpts) {
		return CheckboxGroupContext.set(new CheckboxGroupState(opts));
	}

	readonly opts: CheckboxGroupStateOpts;
	readonly attachment: RefAttachment;
	labelId = $state<string | undefined>(undefined);

	constructor(opts: CheckboxGroupStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
	}

	addValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		if (!this.opts.value.current.includes(checkboxValue)) {
			const newValue = [...$state.snapshot(this.opts.value.current), checkboxValue];
			this.opts.value.current = newValue;
			if (arraysAreEqual(this.opts.value.current, newValue)) return;
			this.opts.onValueChange.current(newValue);
		}
	}

	removeValue(checkboxValue: string | undefined) {
		if (!checkboxValue) return;
		const index = this.opts.value.current.indexOf(checkboxValue);
		if (index === -1) return;
		const newValue = this.opts.value.current.filter((v) => v !== checkboxValue);
		this.opts.value.current = newValue;
		if (arraysAreEqual(this.opts.value.current, newValue)) return;
		this.opts.onValueChange.current(newValue);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				"aria-labelledby": this.labelId,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				[checkboxAttrs.group]: "",
				...this.attachment,
			}) as const
	);
}

interface CheckboxGroupLabelStateOpts extends WithRefOpts {}

export class CheckboxGroupLabelState {
	static create(opts: CheckboxGroupLabelStateOpts) {
		return new CheckboxGroupLabelState(opts, CheckboxGroupContext.get());
	}

	readonly opts: CheckboxGroupLabelStateOpts;
	readonly group: CheckboxGroupState;
	readonly attachment: RefAttachment;

	constructor(opts: CheckboxGroupLabelStateOpts, group: CheckboxGroupState) {
		this.opts = opts;
		this.group = group;
		this.group.labelId = this.opts.id.current;
		this.attachment = attachRef(this.opts.ref);

		watch.pre(
			() => this.opts.id.current,
			(id) => {
				this.group.labelId = id;
			}
		);
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.group.opts.disabled.current),
				[checkboxAttrs["group-label"]]: "",
				...this.attachment,
			}) as const
	);
}

const CheckboxRootContext = new Context<CheckboxRootState>("Checkbox.Root");

interface CheckboxRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
			name: string | undefined;
			value: string | undefined;
			type: HTMLButtonAttributes["type"];
		}>,
		WritableBoxedValues<{
			checked: boolean;
			indeterminate: boolean;
		}> {}

export class CheckboxRootState {
	static create(opts: CheckboxRootStateOpts, group: CheckboxGroupState | null = null) {
		return CheckboxRootContext.set(new CheckboxRootState(opts, group));
	}

	readonly opts: CheckboxRootStateOpts;
	readonly group: CheckboxGroupState | null;
	readonly trueName = $derived.by(() => {
		if (this.group && this.group.opts.name.current) {
			return this.group.opts.name.current;
		} else {
			return this.opts.name.current;
		}
	});
	readonly trueRequired = $derived.by(() => {
		if (this.group && this.group.opts.required.current) {
			return true;
		}
		return this.opts.required.current;
	});
	readonly trueDisabled = $derived.by(() => {
		if (this.group && this.group.opts.disabled.current) {
			return true;
		}
		return this.opts.disabled.current;
	});
	readonly attachment: RefAttachment;

	constructor(opts: CheckboxRootStateOpts, group: CheckboxGroupState | null) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
		this.onkeydown = this.onkeydown.bind(this);
		this.onclick = this.onclick.bind(this);

		watch.pre(
			[() => $state.snapshot(this.group?.opts.value.current), () => this.opts.value.current],
			([groupValue, value]) => {
				if (!groupValue || !value) return;
				this.opts.checked.current = groupValue.includes(value);
			}
		);

		watch.pre(
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

	readonly snippetProps = $derived.by(() => ({
		checked: this.opts.checked.current,
		indeterminate: this.opts.indeterminate.current,
	}));

	readonly props = $derived.by(
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
				[checkboxAttrs.root]: "",
				//
				onclick: this.onclick,
				onkeydown: this.onkeydown,
				...this.attachment,
			}) as const
	);
}

export class CheckboxInputState {
	static create() {
		return new CheckboxInputState(CheckboxRootContext.get());
	}

	readonly root: CheckboxRootState;
	readonly trueChecked = $derived.by(() => {
		if (!this.root.group) return this.root.opts.checked.current;
		if (
			this.root.opts.value.current !== undefined &&
			this.root.group.opts.value.current.includes(this.root.opts.value.current)
		) {
			return true;
		}
		return false;
	});
	readonly shouldRender = $derived.by(() => Boolean(this.root.trueName));

	constructor(root: CheckboxRootState) {
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				type: "checkbox",
				checked: this.root.opts.checked.current === true,
				disabled: this.root.trueDisabled,
				required: this.root.trueRequired,
				name: this.root.trueName,
				value: this.root.opts.value.current,
			}) as const
	);
}

function getCheckboxDataState(checked: boolean, indeterminate: boolean) {
	if (indeterminate) return "indeterminate";
	return checked ? "checked" : "unchecked";
}
