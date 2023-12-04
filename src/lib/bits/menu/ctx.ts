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
import type { Readable, Writable } from "svelte/store";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";

const NAME = "menu";
const SUB_NAME = "menu-submenu";
const RADIO_GROUP_NAME = "menu-radiogroup";
const CHECKBOX_ITEM_NAME = "menu-checkboxitem";
const RADIO_ITEM_NAME = "menu-radioitem";
const GROUP_NAME = "menu-group";

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
	"radio-indicator",
	"separator",
	"sub-content",
	"sub-trigger",
	"trigger"
] as const;

export const getAttrs = createBitAttrs("menu", PARTS);

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

export function getSubmenuCtx() {
	return getContext<GetSubReturn>(SUB_NAME);
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

const defaultPlacement = {
	side: "bottom",
	align: "center"
} satisfies FloatingProps;

export function updatePositioning(props: FloatingProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}

const defaultSubPlacement = {
	side: "right",
	align: "start"
} satisfies FloatingProps;

export function updateSubPositioning(props: FloatingProps) {
	const withDefaults = { ...defaultSubPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getSubmenuCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
