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

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = MenubarReturn;
type GetMenuReturn = MenubarMenuReturn;
type GetSubmenuReturn = MenubarSubReturn;
type GetRadioGroupReturn = MenubarRadioGroupReturn;

export function setCtx(props: MenubarProps) {
	const menubar = createMenubar(removeUndefined(props));
	setContext(NAME, menubar);

	return {
		...menubar,
		updateOption: getOptionUpdater(menubar.options)
	};
}
export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function setMenuCtx(props: CreateMenubarMenuProps) {
	const {
		builders: { createMenu }
	} = getCtx();

	const menu = createMenu({ ...removeUndefined(props), forceVisible: false });
	setContext(MENU_NAME, menu);
	return {
		...menu,
		updateOption: getOptionUpdater(menu.options)
	};
}

export function getMenuCtx() {
	return getContext<GetMenuReturn>(MENU_NAME);
}

export function setSubMenuCtx(props: CreateMenubarSubmenuProps) {
	const {
		builders: { createSubmenu }
	} = getMenuCtx();
	const sub = createSubmenu(removeUndefined(props));
	setContext(SUB_NAME, sub);
	return {
		...sub,
		updateOption: getOptionUpdater(sub.options)
	};
}
export function getSubMenuCtx() {
	return getContext<GetSubmenuReturn>(SUB_NAME);
}

export function setRadioGroupCtx(props: CreateMenuRadioGroupProps) {
	const {
		builders: { createMenuRadioGroup }
	} = getMenuCtx();
	const radioGroup = createMenuRadioGroup(removeUndefined(props));
	setContext(RADIO_GROUP_NAME, radioGroup);
	return radioGroup;
}

export function setRadioItemCtx(value: string) {
	const radioGroup = getContext<GetRadioGroupReturn>(RADIO_GROUP_NAME);
	setContext(RADIO_ITEM_NAME, { isChecked: radioGroup.helpers.isChecked, value });
	return radioGroup;
}

export function getContent(sideOffset = 5) {
	const menu = getMenuCtx();
	menu.options.positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return menu;
}

export function getSubContent(sideOffset = -1) {
	const submenu = getSubMenuCtx();
	submenu.options.positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return submenu;
}

export function setCheckboxItem(props: CreateMenuCheckboxItemProps) {
	const {
		builders: { createCheckboxItem }
	} = getMenuCtx();
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

export function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(RADIO_ITEM_NAME);
}
export function setGroupCtx() {
	const {
		elements: { group }
	} = getMenuCtx();
	const id = generateId();
	setContext(GROUP_NAME, id);
	return { group, id };
}

export function getGroupLabel() {
	const id = getContext<string>(GROUP_NAME) ?? generateId();
	const {
		elements: { groupLabel }
	} = getMenuCtx();
	return { groupLabel, id };
}

export function setArrow(size = 8) {
	const menu = getMenuCtx();
	menu.options.arrowSize.set(size);
	return menu;
}
