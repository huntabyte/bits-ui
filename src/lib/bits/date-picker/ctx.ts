import { createDatePicker, type CreateDatePickerProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "date-picker";
const PARTS = ["label", "input", "segment", "calendar"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

export function setCtx(props: CreateDatePickerProps) {
	const datePicker = createDatePicker(removeUndefined(props));
	const updateOption = getOptionUpdater(datePicker.options);
	setContext(NAME, { ...datePicker, updateOption });

	return {
		...datePicker,
		updateOption: getOptionUpdater(datePicker.options)
	};
}

export function getCtx() {
	return getContext<ReturnType<typeof setCtx>>(NAME);
}
