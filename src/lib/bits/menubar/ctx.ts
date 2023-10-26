import {
	createMenubar,
	type Menubar as MenubarReturn,
	type CreateMenubarProps as MenubarProps,
	type MenubarMenu as MenubarMenuReturn,
	type MenubarMenuRadioGroup as MenubarRadioGroupReturn,
	type CreateMenuRadioGroupProps,
	type CreateMenubarSubmenuProps,
	type CreateMenubarMenuProps,
	type MenubarMenuSubmenu as MenubarSubReturn,
	type CreateMenuCheckboxItemProps,
	type Checkbox as CheckboxReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";
import type { Readable } from "svelte/store";

const NAME = "menubar";
const MENU_NAME = "menubar-menu";
const SUB_NAME = "menubar-sub";
const CHECKBOX_ITEM_NAME = "menubar-checkbox-item";
const RADIO_GROUP_NAME = "menubar-radio-group";
const RADIO_ITEM_NAME = "menubar-radio-item";
const GROUP_NAME = "menubar-group";
const PARTS = [
	"root",
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

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	get,
	set,
	getAttrs,
	setSub,
	getSub,
	setMenu,
	getMenu,
	setArrow,
	setGroup,
	getContent,
	setRadioItem,
	getGroupLabel,
	setRadioGroup,
	getSubContent,
	setCheckboxItem,
	getRadioIndicator,
	getCheckboxIndicator
};

type GetReturn = MenubarReturn;
type GetMenuReturn = MenubarMenuReturn;
type GetSubmenuReturn = MenubarSubReturn;
type GetRadioGroupReturn = MenubarRadioGroupReturn;

function set(props: MenubarProps) {
	const menubar = createMenubar(removeUndefined(props));
	setContext(NAME, menubar);

	return {
		...menubar,
		updateOption: getOptionUpdater(menubar.options)
	};
}
function get() {
	return getContext<GetReturn>(NAME);
}

function setMenu(props: CreateMenubarMenuProps) {
	const {
		builders: { createMenu }
	} = get();

	const menu = createMenu({ ...removeUndefined(props), forceVisible: false });
	setContext(MENU_NAME, menu);
	return {
		...menu,
		updateOption: getOptionUpdater(menu.options)
	};
}

function getMenu() {
	return getContext<GetMenuReturn>(MENU_NAME);
}

function setSub(props: CreateMenubarSubmenuProps) {
	const {
		builders: { createSubmenu }
	} = getMenu();
	const sub = createSubmenu(removeUndefined(props));
	setContext(SUB_NAME, sub);
	return {
		...sub,
		updateOption: getOptionUpdater(sub.options)
	};
}
function getSub() {
	return getContext<GetSubmenuReturn>(SUB_NAME);
}

function setRadioGroup(props: CreateMenuRadioGroupProps) {
	const {
		builders: { createMenuRadioGroup }
	} = getMenu();
	const radioGroup = createMenuRadioGroup(removeUndefined(props));
	setContext(RADIO_GROUP_NAME, radioGroup);
	return radioGroup;
}

function setRadioItem(value: string) {
	const radioGroup = getContext<GetRadioGroupReturn>(RADIO_GROUP_NAME);
	setContext(RADIO_ITEM_NAME, { isChecked: radioGroup.helpers.isChecked, value });
	return radioGroup;
}

function getContent(sideOffset = 5) {
	const menu = getMenu();
	menu.options.positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return menu;
}

function getSubContent(sideOffset = -1) {
	const submenu = getSub();
	submenu.options.positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return submenu;
}

function setCheckboxItem(props: CreateMenuCheckboxItemProps) {
	const {
		builders: { createCheckboxItem }
	} = getMenu();
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

function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(RADIO_ITEM_NAME);
}
function setGroup() {
	const {
		elements: { group }
	} = getMenu();
	const id = generateId();
	setContext(GROUP_NAME, id);
	return { group, id };
}

function getGroupLabel() {
	const id = getContext<string>(GROUP_NAME) ?? generateId();
	const {
		elements: { groupLabel }
	} = getMenu();
	return { groupLabel, id };
}

function setArrow(size = 8) {
	const menu = getMenu();
	menu.options.arrowSize.set(size);
	return menu;
}
