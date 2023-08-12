import { type CreateSelectProps, type Select as SelectReturn, createSelect } from "@melt-ui/svelte";

import { getContext, setContext } from "svelte";
import { generateId, getOptionUpdater, removeUndefined } from "$internal/index.js";

const NAME = "Select";
const GROUP_NAME = "SelectGroup";
const ITEM_NAME = "SelectItem";

export const ctx = {
	set,
	get,
	setGroup,
	setItem,
	getItemIndicator,
	getGroupLabel
};

function get() {
	return getContext<SelectReturn>(NAME);
}

function set(props: CreateSelectProps) {
	const select = createSelect({
		...removeUndefined(props),
		forceVisible: true
	});
	setContext(NAME, select);
	return {
		...select,
		updateOption: getOptionUpdater(select.options)
	};
}

function setGroup() {
	const id = generateId();
	setContext(GROUP_NAME, id);
	const {
		elements: { group }
	} = get();
	return { group, id };
}

function setItem(value: unknown) {
	const select = get();
	setContext(ITEM_NAME, value);
	return select;
}

function getGroupLabel() {
	const id = getContext<string>(GROUP_NAME);
	const {
		elements: { groupLabel }
	} = get();
	return { groupLabel, id };
}

function getItemIndicator() {
	const {
		helpers: { isSelected }
	} = get();
	const value = getContext<unknown>(ITEM_NAME);
	return {
		value,
		isSelected
	};
}
