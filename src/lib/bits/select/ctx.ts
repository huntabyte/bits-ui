import { type CreateSelectProps, type Select as SelectReturn, createSelect } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";

const NAME = "select";
const GROUP_NAME = "select-group";
const ITEM_NAME = "select-item";

const PARTS = ["arrow", "content", "group", "item", "input", "label", "trigger", "value"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	setGroup,
	setItem,
	getItemIndicator,
	getGroupLabel,
	setArrow,
	getAttrs
};

type GetReturn = SelectReturn;

function get() {
	return getContext<GetReturn>(NAME);
}

function set(props: CreateSelectProps) {
	const select = createSelect(removeUndefined(props));
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

function setArrow(size = 8) {
	const select = get();
	select.options.arrowSize?.set(size);
	return select;
}
