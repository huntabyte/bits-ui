import { useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefProps,
} from "$lib/internal/types.js";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import type { Orientation } from "$lib/shared/index.js";
import {
	type UseRovingFocusReturn,
	useRovingFocus,
} from "$lib/internal/use-roving-focus.svelte.js";
import { kbd } from "$lib/internal/kbd.js";

const RADIO_GROUP_ROOT_ATTR = "data-radio-group-root";
const RADIO_GROUP_ITEM_ATTR = "data-radio-group-item";

type RadioGroupRootStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		required: boolean;
		loop: boolean;
		orientation: Orientation;
		name: string | undefined;
	}> &
		WritableBoxedValues<{ value: string }>
>;
class RadioGroupRootState {
	rovingFocusGroup: UseRovingFocusReturn;
	hasValue = $derived.by(() => this.opts.value.current !== "");

	constructor(readonly opts: RadioGroupRootStateProps) {
		this.rovingFocusGroup = useRovingFocus({
			rootNodeId: this.opts.id,
			candidateAttr: RADIO_GROUP_ITEM_ATTR,
			loop: this.opts.loop,
			orientation: this.opts.orientation,
		});

		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	isChecked(value: string) {
		return this.opts.value.current === value;
	}

	setValue(value: string) {
		this.opts.value.current = value;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "radiogroup",
				"aria-required": getAriaRequired(this.opts.required.current),
				"data-disabled": getDataDisabled(this.opts.disabled.current),
				"data-orientation": this.opts.orientation.current,
				[RADIO_GROUP_ROOT_ATTR]: "",
			}) as const
	);
}

//
// RADIO GROUP ITEM
//

type RadioGroupItemStateProps = WithRefProps<
	ReadableBoxedValues<{
		disabled: boolean;
		value: string;
	}>
>;

class RadioGroupItemState {
	checked = $derived.by(() => this.root.opts.value.current === this.opts.value.current);
	#isDisabled = $derived.by(() => this.opts.disabled.current || this.root.opts.disabled.current);
	#isChecked = $derived.by(() => this.root.isChecked(this.opts.value.current));
	#tabIndex = $state(-1);

	constructor(
		readonly opts: RadioGroupItemStateProps,
		readonly root: RadioGroupRootState
	) {
		useRefById(opts);

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
		if (this.opts.disabled.current) return;
		this.root.setValue(this.opts.value.current);
	}

	onfocus(_: BitsFocusEvent) {
		if (!this.root.hasValue) return;
		this.root.setValue(this.opts.value.current);
	}

	onkeydown(e: BitsKeyboardEvent) {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			this.root.setValue(this.opts.value.current);
			return;
		}
		this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e, true);
	}

	snippetProps = $derived.by(() => ({ checked: this.#isChecked }));

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				disabled: this.#isDisabled ? true : undefined,
				"data-value": this.opts.value.current,
				"data-orientation": this.root.opts.orientation.current,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": this.#isChecked ? "checked" : "unchecked",
				"aria-checked": getAriaChecked(this.#isChecked, false),
				[RADIO_GROUP_ITEM_ATTR]: "",
				type: "button",
				role: "radio",
				tabindex: this.#tabIndex,
				//
				onkeydown: this.onkeydown,
				onfocus: this.onfocus,
				onclick: this.onclick,
			}) as const
	);
}

//
// INPUT
//

class RadioGroupInputState {
	shouldRender = $derived.by(() => this.root.opts.name.current !== undefined);
	props = $derived.by(
		() =>
			({
				name: this.root.opts.name.current,
				value: this.root.opts.value.current,
				required: this.root.opts.required.current,
				disabled: this.root.opts.disabled.current,
			}) as const
	);

	constructor(readonly root: RadioGroupRootState) {}
}

const RadioGroupRootContext = new Context<RadioGroupRootState>("RadioGroup.Root");

export function useRadioGroupRoot(props: RadioGroupRootStateProps) {
	return RadioGroupRootContext.set(new RadioGroupRootState(props));
}

export function useRadioGroupItem(props: RadioGroupItemStateProps) {
	return new RadioGroupItemState(props, RadioGroupRootContext.get());
}

export function useRadioGroupInput() {
	return new RadioGroupInputState(RadioGroupRootContext.get());
}
