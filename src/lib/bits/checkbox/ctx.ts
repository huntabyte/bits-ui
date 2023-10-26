import {
	createCheckbox,
	type Checkbox as CheckboxReturn,
	type CreateCheckboxProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "checkbox";
const PARTS = ["root", "input", "indicator"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = CheckboxReturn;

export function setCtx(props: CreateCheckboxProps) {
	const checkbox = createCheckbox(removeUndefined(props));
	setContext(NAME, { ...checkbox });

	return {
		...checkbox,
		updateOption: getOptionUpdater(checkbox.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
