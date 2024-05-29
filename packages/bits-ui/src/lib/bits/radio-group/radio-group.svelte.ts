import type { WritableBox } from "svelte-toolbelt";
import {
	type EventCallback,
	type ReadableBoxedValues,
	type WritableBoxedValues,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
	srOnlyStyles,
	styleToString,
	useNodeById,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";
import { type UseRovingFocusReturn, useRovingFocus } from "$lib/internal/useRovingFocus.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

const ROOT_ATTR = "radio-group-root";
const ITEM_ATTR = "radio-group-item";

type RadioGroupRootStateProps = ReadableBoxedValues<{
	id: string;
	disabled: boolean;
	required: boolean;
	loop: boolean;
	orientation: Orientation;
	name: string | undefined;
}> &
	WritableBoxedValues<{ value: string }>;

class RadioGroupRootState {
	id = undefined as unknown as RadioGroupRootStateProps["id"];
	node: WritableBox<HTMLElement | null>;
	disabled = undefined as unknown as RadioGroupRootStateProps["disabled"];
	required = undefined as unknown as RadioGroupRootStateProps["required"];
	loop: RadioGroupRootStateProps["loop"];
	orientation = undefined as unknown as RadioGroupRootStateProps["orientation"];
	name: RadioGroupRootStateProps["name"];
	value: RadioGroupRootStateProps["value"];
	rovingFocusGroup = undefined as unknown as UseRovingFocusReturn;

	constructor(props: RadioGroupRootStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;
		this.required = props.required;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.name = props.name;
		this.value = props.value;
		this.node = useNodeById(this.id);
		this.rovingFocusGroup = useRovingFocus({
			rootNode: this.node,
			candidateSelector: ITEM_ATTR,
			loop: this.loop,
			orientation: this.orientation,
		});
	}

	isChecked(value: string) {
		return this.value.value === value;
	}

	selectValue(value: string) {
		this.value.value = value;
	}

	createItem(props: RadioGroupItemStateProps) {
		return new RadioGroupItemState(props, this);
	}

	createInput() {
		return new RadioGroupInputState(this);
	}

	props = $derived({
		id: this.id.value,
		role: "radiogroup",
		"aria-required": getAriaRequired(this.required.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-orientation": this.orientation.value,
		[ROOT_ATTR]: "",
	} as const);
}

//
// RADIO GROUP ITEM
//

type RadioGroupItemStateProps = ReadableBoxedValues<{
	disabled: boolean;
	value: string;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
	id: string;
}>;

class RadioGroupItemState {
	#id = undefined as unknown as RadioGroupItemStateProps["id"];
	#node = undefined as unknown as WritableBox<HTMLElement | null>;
	#root = undefined as unknown as RadioGroupRootState;
	#disabled = undefined as unknown as RadioGroupItemStateProps["disabled"];
	#value = undefined as unknown as RadioGroupItemStateProps["value"];
	checked = $derived(this.#root.value.value === this.#value.value);
	#isDisabled = $derived(this.#disabled.value || this.#root.disabled.value);
	#isChecked = $derived(this.#root.isChecked(this.#value.value));

	constructor(props: RadioGroupItemStateProps, root: RadioGroupRootState) {
		this.#disabled = props.disabled;
		this.#value = props.value;
		this.#root = root;
		this.#id = props.id;

		this.#node = useNodeById(this.#id);
	}

	#onclick = () => {
		this.#root.selectValue(this.#value.value);
	};

	#onfocus = () => {
		this.#root.selectValue(this.#value.value);
	};

	#onkeydown = (e: KeyboardEvent) => {
		this.#root.rovingFocusGroup.handleKeydown(this.#node.value, e);
	};

	#tabIndex = $derived(this.#root.rovingFocusGroup.getTabIndex(this.#node.value).value);

	props = $derived({
		id: this.#id.value,
		disabled: this.#isDisabled ? true : undefined,
		"data-value": this.#value.value,
		"data-orientation": this.#root.orientation.value,
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": this.#isChecked ? "checked" : "unchecked",
		"aria-checked": getAriaChecked(this.#isChecked),
		[ITEM_ATTR]: "",
		type: "button",
		role: "radio",
		tabindex: this.#tabIndex,
		//
		onclick: this.#onclick,
		onkeydown: this.#onkeydown,
		onfocus: this.#onfocus,
	} as const);
}

//
// INPUT
//

class RadioGroupInputState {
	#root = undefined as unknown as RadioGroupRootState;
	shouldRender = $derived(this.#root.name.value !== undefined);
	props = $derived({
		name: this.#root.name.value,
		value: this.#root.value.value,
		required: this.#root.required.value,
		disabled: this.#root.disabled.value,
		"aria-hidden": "true",
		hidden: true,
		style: styleToString(srOnlyStyles),
		tabIndex: -1,
	} as const);

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
	return getRadioGroupRootContext().createItem(props);
}

export function useRadioGroupInput() {
	return getRadioGroupRootContext().createInput();
}
