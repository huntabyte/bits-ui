import { attachRef, type ReadableBoxedValues, type WritableBoxedValues } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import {
	createBitsAttrs,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
	getDataReadonly,
	getAriaDisabled,
} from "$lib/internal/attrs.js";
import type { Orientation } from "$lib/shared/index.js";
import { kbd } from "$lib/internal/kbd.js";
import { RovingFocusGroup } from "$lib/internal/roving-focus-group.js";

const radioGroupAttrs = createBitsAttrs({
	component: "radio-group",
	parts: ["root", "item"],
});

const RadioGroupRootContext = new Context<RadioGroupRootState>("RadioGroup.Root");

interface RadioGroupRootStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			required: boolean;
			loop: boolean;
			orientation: Orientation;
			name: string | undefined;
			readonly: boolean;
		}>,
		WritableBoxedValues<{ value: string }> {}
export class RadioGroupRootState {
	static create(opts: RadioGroupRootStateOpts) {
		return RadioGroupRootContext.set(new RadioGroupRootState(opts));
	}

	readonly opts: RadioGroupRootStateOpts;
	readonly hasValue = $derived.by(() => this.opts.value.current !== "");
	readonly rovingFocusGroup: RovingFocusGroup;
	readonly attachment: RefAttachment;

	constructor(opts: RadioGroupRootStateOpts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNode: this.opts.ref,
			candidateAttr: radioGroupAttrs.item,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});
	}

	isChecked(value: string) {
		return this.opts.value.current === value;
	}

	setValue(value: string) {
		this.opts.value.current = value;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "radiogroup",
				"aria-required": getAriaRequired(this.opts.required.current),
				"aria-disabled": getAriaDisabled(this.opts.disabled.current),
				"aria-readonly": this.opts.readonly.current ? "true" : undefined,
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-readonly": getDataReadonly(this.opts.readonly.current),
				"data-orientation": this.opts.orientation.current,
				[radioGroupAttrs.root]: "",
				...this.attachment,
			}) as const
	);
}

interface RadioGroupItemStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			disabled: boolean;
			value: string;
		}> {}

export class RadioGroupItemState {
	static create(opts: RadioGroupItemStateOpts) {
		return new RadioGroupItemState(opts, RadioGroupRootContext.get());
	}

	readonly opts: RadioGroupItemStateOpts;
	readonly root: RadioGroupRootState;
	readonly attachment: RefAttachment;
	readonly checked = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	readonly #isDisabled = $derived.by(
		() => this.opts.disabled.current || this.root.opts.disabled.current
	);
	readonly #isReadonly = $derived.by(() => this.root.opts.readonly.current);
	readonly #isChecked = $derived.by(() => this.root.isChecked(this.opts.value.current));
	#tabIndex = $state(-1);

	constructor(opts: RadioGroupItemStateOpts, root: RadioGroupRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

		if (this.opts.value.current === this.root.opts.value.current) {
			this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
			this.#tabIndex = 0;
		} else if (!this.root.opts.value.current) {
			this.#tabIndex = 0;
		}

		$effect(() => {
			this.#tabIndex = this.root.rovingFocusGroup.getTabIndex(this.opts.ref.current);
		});

		watch([() => this.opts.value.current, () => this.root.opts.value.current], () => {
			if (this.opts.value.current === this.root.opts.value.current) {
				this.root.rovingFocusGroup.setCurrentTabStopId(this.opts.id.current);
				this.#tabIndex = 0;
			}
		});

		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onfocus = this.onfocus.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.opts.disabled.current || this.#isReadonly) return;
		this.root.setValue(this.opts.value.current);
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.root.hasValue || this.#isReadonly) return;
		this.root.setValue(this.opts.value.current);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			if (!this.#isReadonly) {
				this.root.setValue(this.opts.value.current);
			}
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e, true);
	}

	readonly snippetProps = $derived.by(() => ({ checked: this.#isChecked }));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled ? true : undefined,
				"data-value": this.opts.value.current,
				"data-orientation": this.root.opts.orientation.current,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-readonly": getDataReadonly(this.#isReadonly),
				"data-state": this.#isChecked ? "checked" : "unchecked",
				"aria-checked": getAriaChecked(this.#isChecked, false),
				[radioGroupAttrs.item]: "",
				type: "button",
				role: "radio",
				tabindex: this.#tabIndex,
				//
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onclick: this.onclick,
				...this.attachment,
			}) as const
	);
}

export class RadioGroupInputState {
	static create() {
		return new RadioGroupInputState(RadioGroupRootContext.get());
	}

	readonly root: RadioGroupRootState;
	readonly shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);
	readonly props = $derived.by(
		() =>
			({
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				required: this.root.opts.required.current,
				disabled: this.root.opts.disabled.current,
			}) as const
	);

	constructor(root: RadioGroupRootState) {
		this.root = root;
	}
}
