import { getContext, setContext } from "svelte";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "$lib/internal/attrs.js";
import {
	type BoxedValues,
	type ReadonlyBoxedValues,
	boxedState,
	readonlyBox,
} from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/elements.svelte.js";
import { type EventCallback, composeHandlers } from "$lib/internal/events.js";
import { getDirectionalKeys, kbd } from "$lib/internal/kbd.js";
import { getElemDirection } from "$lib/internal/locale.js";
import { withTick } from "$lib/internal/with-tick.js";
import type { Orientation } from "$lib/shared/index.js";
import { verifyContextDeps } from "$lib/internal/context.js";

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
	node = boxedState<HTMLElement | null>(null);
	disabled = undefined as unknown as RadioGroupRootStateProps["disabled"];
	required = undefined as unknown as RadioGroupRootStateProps["required"];
	loop = undefined as unknown as RadioGroupRootStateProps["loop"];
	orientation = undefined as unknown as RadioGroupRootStateProps["orientation"];
	name = undefined as unknown as RadioGroupRootStateProps["name"];
	value = undefined as unknown as RadioGroupRootStateProps["value"];
	#attrs = $derived({
		role: "radiogroup",
		"aria-required": getAriaRequired(this.required.value),
		"data-disabled": getDataDisabled(this.disabled.value),
		"data-orientation": this.orientation.value,
		"data-bits-radio-group": "",
	} as const);

	constructor(props: RadioGroupRootStateProps) {
		this.id = props.id;
		this.disabled = props.disabled;
		this.required = props.required;
		this.loop = props.loop;
		this.orientation = props.orientation;
		this.name = props.name;
		this.value = props.value;

		$effect.pre(() => {
			// eslint-disable-next-line no-unused-expressions
			this.id.value;

			withTick(() => {
				this.node.value = document.getElementById(this.id.value);
			});
		});
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

	get props() {
		return this.#attrs;
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
	#node = boxedState<HTMLElement | null>(null);
	#root = undefined as unknown as RadioGroupRootState;
	#disabled = undefined as unknown as RadioGroupItemStateProps["disabled"];
	#value = undefined as unknown as RadioGroupItemStateProps["value"];
	#isDisabled = $derived(this.#disabled.value || this.#root.disabled.value);
	#isChecked = $derived(this.#root.isChecked(this.#value.value));
	#onclickProp = boxedState<RadioGroupItemStateProps["onclick"]>(readonlyBox(() => () => {}));
	#onkeydownProp = boxedState<RadioGroupItemStateProps["onkeydown"]>(readonlyBox(() => () => {}));

	#attrs = $derived({
		disabled: this.#isDisabled ? true : undefined,
		"data-value": this.#value.value,
		"data-orientation": this.#root.orientation.value,
		"data-disabled": getDataDisabled(this.#isDisabled),
		"data-state": this.#isChecked ? "checked" : "unchecked",
		"aria-checked": getAriaChecked(this.#isChecked),
		"data-bits-radio-group-item": "",
		type: "button",
		role: "radio",
	} as const);

	constructor(props: RadioGroupItemStateProps, root: RadioGroupRootState) {
		this.#disabled = props.disabled;
		this.#value = props.value;
		this.#root = root;
		this.#id = props.id;

		useNodeById(this.#id, this.#node);
	}

	onclick = composeHandlers(this.#onclickProp, () => {
		this.#root.selectValue(this.#value.value);
	});

	onkeydown = composeHandlers(this.#onkeydownProp, (e) => {
		if (!this.#root.node.value || !this.#node.value) return;
		const items = this.#root.getRadioItemNodes();
		if (!items.length) return;

		const currentIndex = items.indexOf(this.#node.value);

		const dir = getElemDirection(this.#root.node.value);
		const { nextKey, prevKey } = getDirectionalKeys(dir, this.#root.orientation.value);

		let itemToFocus: HTMLElement | undefined;
		const loop = this.#root.loop.value;

		const keyMap = {
			[nextKey]: () => {
				e.preventDefault();
				const nextIndex = currentIndex + 1;
				if (nextIndex >= items.length && loop) {
					itemToFocus = items[0];
				} else {
					itemToFocus = items[nextIndex];
				}
			},
			[prevKey]: () => {
				e.preventDefault();
				const prevIndex = currentIndex - 1;
				if (prevIndex < 0 && loop) {
					itemToFocus = items[items.length - 1];
				} else {
					itemToFocus = items[prevIndex];
				}
			},
			[kbd.HOME]: () => {
				e.preventDefault();
				itemToFocus = items[0];
			},
			[kbd.END]: () => {
				e.preventDefault();
				itemToFocus = items[items.length - 1];
			},
		};

		keyMap[e.key]?.();

		if (itemToFocus) {
			itemToFocus.focus();
			this.#root.selectValue(itemToFocus.dataset.value as string);
		}
	});

	get props() {
		return {
			...this.#attrs,
			onclick,
			onkeydown,
		};
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
