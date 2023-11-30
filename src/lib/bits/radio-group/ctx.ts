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
const PARTS = ["root", "item", "input", "item-indicator"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = RadioGroupReturn;

export function setCtx(props: CreateRadioGroupProps) {
	const radioGroup = createRadioGroup(removeUndefined(props));
	setContext(NAME, radioGroup);
	return {
		...radioGroup,
		updateOption: getOptionUpdater(radioGroup.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function setItemCtx(value: string) {
	const radioGroup = getCtx();
	setContext(ITEM_NAME, { value, isChecked: radioGroup.helpers.isChecked });
	return radioGroup;
}

export function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(ITEM_NAME);
}
