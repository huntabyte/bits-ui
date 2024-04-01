import { type CreateDateRangeFieldProps, createDateRangeField } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { getDateFieldData } from "../date-field/ctx.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateDateRangeFieldProps) {
	const { NAME, PARTS } = getDateFieldData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const dateRangeField = { ...createDateRangeField(removeUndefined(props)), getAttrs };

	setContext(NAME, dateRangeField);

	return {
		...dateRangeField,
		updateOption: getOptionUpdater(dateRangeField.options),
	};
}

export function getCtx() {
	const { NAME } = getDateFieldData();
	return getContext<GetReturn>(NAME);
}
