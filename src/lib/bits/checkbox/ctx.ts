import {
	createCheckbox,
	type Checkbox as CheckboxReturn,
	type CreateCheckboxProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "checkbox";
const PARTS = ["root", "input", "indicator"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	getAttrs
};

type GetReturn = CheckboxReturn;

function set(props: CreateCheckboxProps) {
	const checkbox = createCheckbox(removeUndefined(props));
	setContext(NAME, { ...checkbox });

	return {
		...checkbox,
		updateOption: getOptionUpdater(checkbox.options)
	};
}

function get() {
	return getContext<GetReturn>(NAME);
}
