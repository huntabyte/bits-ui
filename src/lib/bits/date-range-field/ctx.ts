import {
	type DateRangeField as DateRangeFieldReturn,
	type CreateDateRangeFieldProps,
	createDateRangeField
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "date-field";
const PARTS = ["label", "field", "input", "segment"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = DateRangeFieldReturn;

export function setCtx(props: CreateDateRangeFieldProps) {
	const dateField = createDateRangeField(removeUndefined(props));
	setContext(NAME, dateField);

	return {
		...dateField,
		updateOption: getOptionUpdater(dateField.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
