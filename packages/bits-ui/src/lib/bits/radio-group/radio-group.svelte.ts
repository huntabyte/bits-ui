import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import type { FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from "svelte/elements";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import type { Orientation } from "$lib/shared/index.js";
import { RovingFocusGroup } from "$lib/internal/use-roving-focus.svelte.js";
import { createContext } from "$lib/internal/create-context.js";
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
	#id: RadioGroupRootStateProps["id"];
	#ref: RadioGroupRootStateProps["ref"];
	disabled: RadioGroupRootStateProps["disabled"];
	required: RadioGroupRootStateProps["required"];
	loop: RadioGroupRootStateProps["loop"];
	orientation: RadioGroupRootStateProps["orientation"];
	name: RadioGroupRootStateProps["name"];
	value: RadioGroupRootStateProps["value"];
	rovingFocusGroup: RovingFocusGroup;
	hasValue = $derived.by(() => this.value.current !== "");

	constructor(props: RadioGroupRootStateProps) {
		this.#id = props.id;
		this.disabled = props.disabled;
		this.required = props.required;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.name = props.name;
		this.value = props.value;
		this.#ref = props.ref;
		this.rovingFocusGroup = new RovingFocusGroup({
			rootNodeId: this.#id,
			candidateSelector: `[${RADIO_GROUP_ITEM_ATTR}]:not([data-disabled])`,
			loop: this.loop,
			orientation: this.orientation,
		});

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	isChecked = (value: string) => {
		return this.value.current === value;
	};

	setValue = (value: string) => {
		this.value.current = value;
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				role: "radiogroup",
				"aria-required": getAriaRequired(this.required.current),
				"data-disabled": getDataDisabled(this.disabled.current),
				"data-orientation": this.orientation.current,
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
	#id: RadioGroupItemStateProps["id"];
	#ref: RadioGroupItemStateProps["ref"];
	#root: RadioGroupRootState;
	#disabled: RadioGroupItemStateProps["disabled"];
	#value: RadioGroupItemStateProps["value"];
	checked = $derived.by(() => this.#root.value.current === this.#value.current);
	#isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled.current);
	#isChecked = $derived.by(() => this.#root.isChecked(this.#value.current));

	constructor(props: RadioGroupItemStateProps, root: RadioGroupRootState) {
		this.#disabled = props.disabled;
		this.#value = props.value;
		this.#root = root;
		this.#id = props.id;
		this.#ref = props.ref;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});

		$effect(() => {
			this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
		});
	}

	#onclick: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (this.#disabled.current) return;
		this.#root.setValue(this.#value.current);
	};

	#onfocus: FocusEventHandler<HTMLButtonElement> = () => {
		if (!this.#root.hasValue) return;
		this.#root.setValue(this.#value.current);
	};

	#onkeydown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
		if (this.#isDisabled) return;
		if (e.key === kbd.SPACE) {
			e.preventDefault();
			this.#root.setValue(this.#value.current);
			return;
		}
		this.#root.rovingFocusGroup.handleKeydown({
			node: this.#ref.current,
			event: e,
			orientation: this.#root.orientation.current,
			both: true,
		});
	};

	#tabIndex = $state(0);

	snippetProps = $derived.by(() => ({ checked: this.#isChecked }));

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				disabled: this.#isDisabled ? true : undefined,
				"data-value": this.#value.current,
				"data-orientation": this.#root.orientation.current,
				"data-disabled": getDataDisabled(this.#isDisabled),
				"data-state": this.#isChecked ? "checked" : "unchecked",
				"aria-checked": getAriaChecked(this.#isChecked, false),
				[RADIO_GROUP_ITEM_ATTR]: "",
				type: "button",
				role: "radio",
				tabindex: this.#tabIndex,
				//
				onkeydown: this.#onkeydown,
				onfocus: this.#onfocus,
				onclick: this.#onclick,
			}) as const
	);
}

//
// INPUT
//

class RadioGroupInputState {
	#root: RadioGroupRootState;
	shouldRender = $derived.by(() => this.#root.name.current !== undefined);
	props = $derived.by(
		() =>
			({
				name: this.#root.name.current,
				value: this.#root.value.current,
				required: this.#root.required.current,
				disabled: this.#root.disabled.current,
				"aria-hidden": "true",
				hidden: true,
				style: styleToString(srOnlyStyles),
				tabIndex: -1,
			}) as const
	);

	constructor(root: RadioGroupRootState) {
		this.#root = root;
	}
}

//
// CONTEXT METHODS
//

const [setRadioGroupRootContext, getRadioGroupRootContext] =
	createContext<RadioGroupRootState>("RadioGroup.Root");

export function useRadioGroupRoot(props: RadioGroupRootStateProps) {
	return setRadioGroupRootContext(new RadioGroupRootState(props));
}

export function useRadioGroupItem(props: RadioGroupItemStateProps) {
	return new RadioGroupItemState(props, getRadioGroupRootContext());
}

export function useRadioGroupInput() {
	return new RadioGroupInputState(getRadioGroupRootContext());
}
