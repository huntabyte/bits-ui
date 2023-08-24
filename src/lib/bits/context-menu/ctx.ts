import { generateId, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	type ContextMenu as ContextMenuReturn,
	type ContextMenuRadioGroup as ContextRadioGroupReturn,
	type ContextMenuSubmenu as ContextSubmenuReturn,
	type Checkbox as CheckboxReturn,
	type CreateContextMenuCheckboxItemProps as ContextCheckboxItemProps,
	createContextMenu,
	type CreateContextMenuProps,
	type CreateContextMenuRadioGroupProps,
	type CreateContextSubmenuProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Readable } from "svelte/store";

const NAME = "ContextMenu";
const SUB_NAME = "ContextSubmenu";
const RADIO_GROUP_NAME = "ContextRadioGroup";
const CHECKBOX_ITEM_NAME = "ContextCheckboxItem";
const RADIO_ITEM_NAME = "ContextRadioItem";
const GROUP_NAME = "ContextGroup";

export const ctx = {
	get,
	set,
	setSub,
	getSub,
	getContent,
	setRadioGroup,
	setRadioItem,
	getSubTrigger,
	getSubContent,
	setCheckboxItem,
	getCheckboxIndicator,
	getRadioIndicator,
	setGroup,
	getGroupLabel,
	setArrow
};

function set(props: CreateContextMenuProps) {
	const contextMenu = createContextMenu(removeUndefined(props));
	setContext(NAME, contextMenu);
	return {
		...contextMenu,
		updateOption: getOptionUpdater(contextMenu.options)
	};
}

function get() {
	return getContext<ContextMenuReturn>(NAME);
}

function setSub(props: CreateContextSubmenuProps) {
	const {
		builders: { createSubmenu }
	} = get();
	const sub = createSubmenu(removeUndefined(props));
	setContext(SUB_NAME, sub);
	return {
		...sub,
		updateOption: getOptionUpdater(sub.options)
	};
}

function getSub() {
	return getContext<ContextSubmenuReturn>(SUB_NAME);
}

function setRadioGroup(props: CreateContextMenuRadioGroupProps) {
	const {
		builders: { createMenuRadioGroup }
	} = get();
	const radioGroup = createMenuRadioGroup(removeUndefined(props));
	setContext(RADIO_GROUP_NAME, radioGroup);
	return radioGroup;
}

function setRadioItem(value: string) {
	const radioGroup = getContext<ContextRadioGroupReturn>(RADIO_GROUP_NAME);
	setContext(RADIO_ITEM_NAME, {
		isChecked: radioGroup.helpers.isChecked,
		value
	});
	return radioGroup;
}

function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(RADIO_ITEM_NAME);
}

function getSubTrigger() {
	return getContext<ContextSubmenuReturn>(SUB_NAME);
}

function getContent(sideoffset = 5) {
	const menu = get();

	menu.options.positioning.update((prev) => ({ ...prev, gutter: sideoffset }));

	return menu;
}

function getSubContent(sideOffset = -1) {
	const submenu = getContext<ContextSubmenuReturn>(SUB_NAME);
	const {
		options: { positioning }
	} = submenu;
	positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return submenu;
}

function setCheckboxItem(props: ContextCheckboxItemProps) {
	const {
		builders: { createCheckboxItem }
	} = get();
	const checkboxItem = createCheckboxItem(removeUndefined(props));
	setContext(CHECKBOX_ITEM_NAME, checkboxItem.states.checked);

	return {
		...checkboxItem,
		updateOption: getOptionUpdater(checkboxItem.options)
	};
}

function getCheckboxIndicator() {
	return getContext<CheckboxReturn["states"]["checked"]>(CHECKBOX_ITEM_NAME);
}

function setGroup() {
	const {
		elements: { group }
	} = get();
	const id = generateId();
	setContext(GROUP_NAME, id);
	return { group, id };
}

function getGroupLabel() {
	const id = getContext<string>(GROUP_NAME) ?? generateId();
	const {
		elements: { groupLabel }
	} = get();
	return { groupLabel, id };
}

function setArrow(size = 8) {
	const menu = get();
	menu.options.arrowSize.set(size);
	return menu;
}
