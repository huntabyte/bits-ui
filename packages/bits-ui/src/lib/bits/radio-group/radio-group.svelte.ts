import { getContext, setContext } from "svelte";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import {
	type Box,
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
} from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/elements.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { getDirectionalKeys, kbd } from "$lib/internal/kbd.js";
import { getElemDirection } from "$lib/internal/locale.js";
import type { Orientation } from "$lib/shared/index.js";
import { verifyContextDeps } from "$lib/internal/context.js";
import { srOnlyStyles, styleToString } from "$lib/internal/style.js";

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
	id: RadioGroupRootStateProps["id"];
	node: Box<HTMLElement | null>;
	disabled: RadioGroupRootStateProps["disabled"];
	required: RadioGroupRootStateProps["required"];
	loop: RadioGroupRootStateProps["loop"];
	orientation: RadioGroupRootStateProps["orientation"];
	name: RadioGroupRootStateProps["name"];
	value: RadioGroupRootStateProps["value"];
	activeTabIndexNode = boxedState<HTMLElement | null>(null);

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

		return Array.from(this.node.value.querySelectorAll("[data-bits-radio-group-item]")).filter(
			(el): el is HTMLElement => el instanceof HTMLElement && !el.dataset.disabled
		);
	}

	createItem(props: RadioGroupItemStateProps) {
		return new RadioGroupItemState(props, this);
	}

	createInput() {
		return new RadioGroupInputState(this);
	}

	get props() {
		return {
			id: this.id.value,
			role: "radiogroup",
			"aria-required": getAriaRequired(this.required.value),
			"data-disabled": getDataDisabled(this.disabled.value),
			"data-orientation": this.orientation.value,
			"data-bits-radio-group": "",
		} as const;
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
	#id: RadioGroupItemStateProps["id"];
	#node: Box<HTMLElement | null>;
	#root = undefined as unknown as RadioGroupRootState;
	#disabled: RadioGroupItemStateProps["disabled"];
	#value = undefined as unknown as RadioGroupItemStateProps["value"];
	#composedClick: EventCallback<MouseEvent>;
	#composedKeydown: EventCallback<KeyboardEvent>;
	checked = $derived(this.#root.value.value === this.#value.value);

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
		if (!this.#root.node.value || !this.#node.value) return;
		const items = this.#root.getRadioItemNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(this.#node.value);

		const dir = getElemDirection(this.#root.node.value);
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

	get #isDisabled() {
		return this.#disabled.value || this.#root.disabled.value;
	}

	get #isChecked() {
		return this.#root.isChecked(this.#value.value);
	}

	get props() {
		return {
			id: this.#id.value,
			disabled: this.#isDisabled ? true : undefined,
			"data-value": this.#value.value,
			"data-orientation": this.#root.orientation.value,
			"data-disabled": getDataDisabled(this.#isDisabled),
			"data-state": this.#isChecked ? "checked" : "unchecked",
			"aria-checked": getAriaChecked(this.#isChecked),
			"data-bits-radio-group-item": "",
			type: "button",
			role: "radio",
			tabIndex: this.#root.activeTabIndexNode.value === this.#node.value ? 0 : -1,
			//
			onclick: this.#composedClick,
			onkeydown: this.#composedKeydown,
		} as const;
	}
}

//
// INPUT
//

class RadioGroupInputState {
	#root = undefined as unknown as RadioGroupRootState;
	shouldRender = $derived(this.#root.name.value !== undefined);

	constructor(root: RadioGroupRootState) {
		this.#root = root;
	}

	get props() {
		return {
			name: this.#root.name.value,
			value: this.#root.value.value,
			required: this.#root.required.value,
			disabled: this.#root.disabled.value,
			"aria-hidden": "true",
			hidden: true,
			style: styleToString(srOnlyStyles),
			tabIndex: -1,
		} as const;
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
