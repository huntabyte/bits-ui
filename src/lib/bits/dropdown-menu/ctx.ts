import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";
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

const NAME = "dropdown-menu";
const SUB_NAME = "dropdown-menu-submenu";
const RADIO_GROUP_NAME = "dropdown-menu-radiogroup";
const CHECKBOX_ITEM_NAME = "dropdown-menu-checkboxitem";
const RADIO_ITEM_NAME = "dropdown-menu-radioitem";
const GROUP_NAME = "dropdown-menu-group";

const PARTS = [
	"arrow",
	"checkbox-indicator",
	"checkbox-item",
	"content",
	"group",
	"item",
	"label",
	"radio-group",
	"radio-item",
	"separator",
	"sub-content",
	"sub-trigger",
	"trigger"
] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = DropdownMenuReturn;
type GetSubReturn = DropdownSubmenuReturn;
type GetRadioGroupReturn = DropdownRadioGroupReturn;

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function setCtx(props: CreateDropdownMenuProps) {
	const dropdownMenu = createDropdownMenu({ ...removeUndefined(props), forceVisible: true });
	setContext(NAME, dropdownMenu);
	return {
		...dropdownMenu,
		updateOption: getOptionUpdater(dropdownMenu.options)
	};
}

export function setSubMenuCtx(props: DropdownSubmenuProps) {
	const {
		builders: { createSubmenu }
	} = getCtx();
	const sub = createSubmenu(removeUndefined(props));
	setContext(SUB_NAME, sub);
	return {
		...sub,
		updateOption: getOptionUpdater(sub.options)
	};
}

export function setRadioGroupCtx(props: DropdownRadioGroupProps) {
	const {
		builders: { createMenuRadioGroup }
	} = getCtx();
	const radioGroup = createMenuRadioGroup(props);
	setContext(RADIO_GROUP_NAME, radioGroup);
	return radioGroup;
}

export function setRadioItem(value: string) {
	const dropdownMenu = getContext<GetRadioGroupReturn>(RADIO_GROUP_NAME);
	setContext(RADIO_ITEM_NAME, { isChecked: dropdownMenu.helpers.isChecked, value });
	return dropdownMenu;
}

export function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(RADIO_ITEM_NAME);
}

export function getSubTrigger() {
	const submenu = getContext<GetSubReturn>(SUB_NAME);
	return submenu;
}

export function getContent(sideoffset = 5) {
	const menu = getCtx();
	menu.options.positioning.update((prev) => ({ ...prev, gutter: sideoffset }));

	return menu;
}

export function getSubContent(sideOffset = -1) {
	const submenu = getContext<GetSubReturn>(SUB_NAME);
	submenu.options.positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return submenu;
}

export function setCheckboxItem(props: DropdownCheckboxItemProps) {
	const {
		builders: { createCheckboxItem }
	} = getCtx();
	const checkboxItem = createCheckboxItem(removeUndefined(props));
	setContext(CHECKBOX_ITEM_NAME, checkboxItem.states.checked);

	return {
		...checkboxItem,
		updateOption: getOptionUpdater(checkboxItem.options)
	};
}

export function getCheckboxIndicator() {
	return getContext<CheckboxReturn["states"]["checked"]>(CHECKBOX_ITEM_NAME);
}
export function setGroupCtx() {
	const {
		elements: { group }
	} = getCtx();
	const id = generateId();
	setContext(GROUP_NAME, id);
	return { group, id };
}

export function getGroupLabel() {
	const id = getContext<string>(GROUP_NAME) ?? generateId();
	const {
		elements: { groupLabel }
	} = getCtx();
	return { groupLabel, id };
}

export function setArrow(size = 8) {
	const menu = getCtx();
	menu.options.arrowSize.set(size);
	return menu;
}
