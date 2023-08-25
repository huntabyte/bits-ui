import {
	createCheckbox,
	type Checkbox as CheckboxReturn,
	type CreateCheckboxProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater } from "$lib/internal/index.js";

const NAME = "Checkbox";

export const ctx = {
	set,
	get
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
