import { getContext, setContext } from "svelte";
import {
	type Box,
	type BoxedValues,
	type EventCallback,
	type ReadonlyBoxedValues,
	boxedState,
	composeHandlers,
	getAriaChecked,
	getAriaRequired,
	getDataDisabled,
	getDirectionalKeys,
	getElemDirection,
	kbd,
	srOnlyStyles,
	styleToString,
	useNodeById,
	verifyContextDeps,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";

type RadioGroupRootStateProps = ReadonlyBoxedValues<{
	id: string;
	disabled: boolean;
	required: boolean;
	loop: boolean;
	orientation: Orientation;
	name: string | undefined;
}> &
	BoxedValues<{ value: string }>;

class RadioGroupRootState {
	id = undefined as unknown as RadioGroupRootStateProps["id"];
	node: Box<HTMLElement | null>;
	disabled = undefined as unknown as RadioGroupRootStateProps["disabled"];
	required = undefined as unknown as RadioGroupRootStateProps["required"];
	loop: RadioGroupRootStateProps["loop"];
	orientation = undefined as unknown as RadioGroupRootStateProps["orientation"];
	name: RadioGroupRootStateProps["name"];
	value: RadioGroupRootStateProps["value"];
	activeTabIndexNode = boxedState<HTMLElement | null>(null);
	props = $derived({
		id: this.id.value,
		role: "radiogroup",
		"aria-required": getAriaRequired(this.required.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-orientation": this.orientation.value,
		"data-radio-group": "",
	} as const);

	constructor(props: RadioGroupRootStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;
		this.required = props.required;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.name = props.name;
		this.value = props.value;
		this.node = useNodeById(this.id);
	}

	isChecked(value: string) {
		return this.value.value === value;
	}

	selectValue(value: string) {
		this.value.value = value;
	}

	getRadioItemNodes() {
		if (!this.node.value) return [];

		return Array.from(this.node.value.querySelectorAll("[data-radio-group-item]")).filter(
			(el): el is HTMLElement => el instanceof HTMLElement && !el.dataset.disabled
		);
	}

	createItem(props: RadioGroupItemStateProps) {
		return new RadioGroupItemState(props, this);
	}

	createInput() {
		return new RadioGroupInputState(this);
	}
}

//
// RADIO GROUP ITEM
//

type RadioGroupItemStateProps = ReadonlyBoxedValues<{
	disabled: boolean;
	value: string;
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
	id: string;
}>;

class RadioGroupItemState {
	#id = undefined as unknown as RadioGroupItemStateProps["id"];
	#node = undefined as unknown as Box<HTMLElement | null>;
	#root = undefined as unknown as RadioGroupRootState;
	#disabled = undefined as unknown as RadioGroupItemStateProps["disabled"];
	#value = undefined as unknown as RadioGroupItemStateProps["value"];
	#composedClick = undefined as unknown as EventCallback<MouseEvent>;
	#composedKeydown = undefined as unknown as EventCallback<KeyboardEvent>;
	checked = $derived(this.#root.value.value === this.#value.value);
	#isDisabled = $derived(this.#disabled.value || this.#root.disabled.value);
	#isChecked = $derived(this.#root.isChecked(this.#value.value));
	props = $derived({
		id: this.#id.value,
		disabled: this.#isDisabled ? true : undefined,
		"data-value": this.#value.value,
		"data-orientation": this.#root.orientation.value,
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": this.#isChecked ? "checked" : "unchecked",
		"aria-checked": getAriaChecked(this.#isChecked),
		"data-radio-group-item": "",
		type: "button",
		role: "radio",
		tabIndex: this.#root.activeTabIndexNode.value === this.#node.value ? 0 : -1,
		//
		onclick: this.#composedClick,
		onkeydown: this.#composedKeydown,
	} as const);

	indicatorProps = $derived({
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": this.#isChecked ? "checked" : "unchecked",
		"data-radio-group-item-indicator": "",
	} as const);

	constructor(props: RadioGroupItemStateProps, root: RadioGroupRootState) {
		this.#disabled = props.disabled;
		this.#value = props.value;
		this.#root = root;
		this.#id = props.id;
		this.#composedClick = composeHandlers(props.onclick, this.#onclick);
		this.#composedKeydown = composeHandlers(props.onkeydown, this.#onkeydown);

		this.#node = useNodeById(this.#id);

		$effect(() => {
			if (!this.#node.value) return;
			if (!this.#root.isChecked(this.#value.value)) return;
			this.#root.activeTabIndexNode.value = this.#node.value;
		});
	}

	#onclick = () => {
		this.#root.selectValue(this.#value.value);
	};

	#onkeydown = (e: KeyboardEvent) => {
		const node = this.#node.value;
		const rootNode = this.#root.node.value;
		if (!node || !rootNode) return;
		const items = this.#root.getRadioItemNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(node);

		const dir = getElemDirection(rootNode);
		const { nextKey, prevKey } = getDirectionalKeys(dir, this.#root.orientation.value);

		const loop = this.#root.loop.value;

		const keyToIndex = {
			[nextKey]: currentIndex + 1,
			[prevKey]: currentIndex - 1,
			[kbd.HOME]: 0,
			[kbd.END]: items.length - 1,
		};

		let itemIndex = keyToIndex[e.key];
		if (itemIndex === undefined) return;
		e.preventDefault();

		if (itemIndex < 0 && loop) itemIndex = items.length - 1;
		else if (itemIndex === items.length && loop) itemIndex = 0;

		const itemToFocus = items[itemIndex];
		if (!itemToFocus) return;
		itemToFocus.focus();
		this.#root.selectValue(itemToFocus.dataset.value as string);
	};
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

const RADIO_GROUP_ROOT_KEY = Symbol("RadioGroup.Root");

export function setRadioGroupRootState(props: RadioGroupRootStateProps) {
	return setContext(RADIO_GROUP_ROOT_KEY, new RadioGroupRootState(props));
}

export function getRadioGroupRootState() {
	verifyContextDeps(RADIO_GROUP_ROOT_KEY);
	return getContext<RadioGroupRootState>(RADIO_GROUP_ROOT_KEY);
}

export function setRadioGroupItemState(props: RadioGroupItemStateProps) {
	return getRadioGroupRootState().createItem(props);
}

export function getRadioGroupInputState() {
	return getRadioGroupRootState().createInput();
}
