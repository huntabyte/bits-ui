import { createBitAttrs, getOptionUpdater } from "$lib/internal/index.js";
import {
	createRadioGroup,
	type CreateRadioGroupProps,
	type RadioGroup as RadioGroupReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined } from "$lib/internal/index.js";
import type { Readable } from "svelte/store";

const NAME = "radio-group";
const ITEM_NAME = "radio-group-item";
const PARTS = ["root", "item", "input"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	setItem,
	getRadioIndicator,
	getAttrs
};

type GetReturn = RadioGroupReturn;

function set(props: CreateRadioGroupProps) {
	const radioGroup = createRadioGroup(removeUndefined(props));
	setContext(NAME, radioGroup);
	return {
		...radioGroup,
		updateOption: getOptionUpdater(radioGroup.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}

function setItem(value: string) {
	const radioGroup = get();
	setContext(ITEM_NAME, { value, isChecked: radioGroup.helpers.isChecked });
	return radioGroup;
}

function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(ITEM_NAME);
}
