import {
	createDateField,
	type DateField as DateFieldReturn,
	type CreateDateFieldProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "date-field";
const PARTS = ["label", "input", "segment"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = DateFieldReturn;

export function setCtx(props: CreateDateFieldProps) {
	const dateField = createDateField(removeUndefined(props));
	setContext(NAME, dateField);

	return {
		...dateField,
		updateOption: getOptionUpdater(dateField.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
