import { generateId, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	type CreateDropdownSubmenuProps as DropdownSubmenuProps,
	type DropdownMenu as DropdownMenuReturn,
	type CreateMenuRadioGroupProps as DropdownRadioGroupProps,
	type DropdownMenuRadioGroup as DropdownRadioGroupReturn,
	type DropdownMenuSubmenu as DropdownSubmenuReturn,
	type Checkbox as CheckboxReturn,
	type CreateDropdownMenuCheckboxItemProps as DropdownCheckboxItemProps,
	type CreateDropdownMenuProps,
	createDropdownMenu
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Readable } from "svelte/store";

const NAME = "DropdownMenu";
const SUB_NAME = "DropdownSubmenu";
const RADIO_GROUP_NAME = "DropdownRadioGroup";
const CHECKBOX_ITEM_NAME = "DropdownCheckboxItem";
const RADIO_ITEM_NAME = "DropdownRadioItem";
const GROUP_NAME = "DropdownGroup";

export const ctx = {
	get,
	set,
	setSub,
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

type GetReturn = DropdownMenuReturn;
type GetSubReturn = DropdownSubmenuReturn;
type GetRadioGroupReturn = DropdownRadioGroupReturn;

function get() {
	return getContext<GetReturn>(NAME);
}

function set(props: CreateDropdownMenuProps) {
	const dropdownMenu = createDropdownMenu({ ...removeUndefined(props), forceVisible: true });
	setContext(NAME, dropdownMenu);
	return {
		...dropdownMenu,
		updateOption: getOptionUpdater(dropdownMenu.options)
	};
}

function setSub(props: DropdownSubmenuProps) {
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

function setRadioGroup(props: DropdownRadioGroupProps) {
	const {
		builders: { createMenuRadioGroup }
	} = get();
	const radioGroup = createMenuRadioGroup(props);
	setContext(RADIO_GROUP_NAME, radioGroup);
	return radioGroup;
}

function setRadioItem(value: string) {
	const dropdownMenu = getContext<GetRadioGroupReturn>(RADIO_GROUP_NAME);
	setContext(RADIO_ITEM_NAME, { isChecked: dropdownMenu.helpers.isChecked, value });
	return dropdownMenu;
}

function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(RADIO_ITEM_NAME);
}

function getSubTrigger() {
	const submenu = getContext<GetSubReturn>(SUB_NAME);
	return submenu;
}

function getContent(sideoffset = 5) {
	const menu = get();
	menu.options.positioning.update((prev) => ({ ...prev, gutter: sideoffset }));

	return menu;
}

function getSubContent(sideOffset = -1) {
	const submenu = getContext<GetSubReturn>(SUB_NAME);
	submenu.options.positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return submenu;
}

function setCheckboxItem(props: DropdownCheckboxItemProps) {
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
