import { createBitAttrs, getOptionUpdater } from "$lib/internal/index.js";
import { createRadioGroup, type CreateRadioGroupProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined } from "$lib/internal/index.js";

function getRadioGroupData() {
	const NAME = "radio-group" as const;
	const ITEM_NAME = "radio-group-item";
	const PARTS = ["root", "item", "input", "item-indicator"] as const;

	return {
		NAME,
		ITEM_NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateRadioGroupProps) {
	const { NAME, PARTS } = getRadioGroupData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const radioGroup = { ...createRadioGroup(removeUndefined(props)), getAttrs };
	setContext(NAME, radioGroup);
	return {
		...radioGroup,
		updateOption: getOptionUpdater(radioGroup.options),
	};
}

export function getCtx() {
	const { NAME } = getRadioGroupData();
	return getContext<GetReturn>(NAME);
}

export function setItemCtx(value: string) {
	const { ITEM_NAME } = getRadioGroupData();
	const radioGroup = { ...getCtx(), value };
	setContext(ITEM_NAME, radioGroup);
	return radioGroup;
}

type GetItemReturn = Omit<ReturnType<typeof setItemCtx>, "updateOption">;
export function getRadioIndicator() {
	const { ITEM_NAME } = getRadioGroupData();
	return getContext<GetItemReturn>(ITEM_NAME);
}
