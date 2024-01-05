import { createDateField, type CreateDateFieldProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

export function getDateFieldData() {
	const NAME = "date-field" as const;
	const PARTS = ["label", "input", "segment"] as const;

	return {
		NAME,
		PARTS
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateDateFieldProps) {
	const { NAME, PARTS } = getDateFieldData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const dateField = { ...createDateField(removeUndefined(props)), getAttrs };
	setContext(NAME, dateField);

	return {
		...dateField,
		updateOption: getOptionUpdater(dateField.options)
	};
}

export function getCtx() {
	const { NAME } = getDateFieldData();
	return getContext<GetReturn>(NAME);
}
