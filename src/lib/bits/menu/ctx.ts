import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";
import {
	type CreateDropdownSubmenuProps as DropdownSubmenuProps,
	type CreateMenuRadioGroupProps as DropdownRadioGroupProps,
	type Checkbox as CheckboxReturn,
	type CreateDropdownMenuCheckboxItemProps as DropdownCheckboxItemProps,
	type CreateDropdownMenuProps,
	createDropdownMenu
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";

export function getMenuData() {
	const NAME = "menu" as const;
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

	return {
		NAME,
		SUB_NAME,
		RADIO_GROUP_NAME,
		CHECKBOX_ITEM_NAME,
		RADIO_ITEM_NAME,
		GROUP_NAME,
		PARTS
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
type GetSubReturn = Omit<ReturnType<typeof setSubMenuCtx>, "updateOption">;
type GetRadioGroupReturn = ReturnType<typeof setRadioGroupCtx>;
type GetRadioItem = ReturnType<typeof setRadioItem>;

export function getCtx() {
	const { NAME } = getMenuData();
	return getContext<GetReturn>(NAME);
}

export function setCtx(props: CreateDropdownMenuProps) {
	const { NAME, PARTS } = getMenuData();
	const getAttrs = createBitAttrs("menu", PARTS);
	const dropdownMenu = {
		...createDropdownMenu({ ...removeUndefined(props), forceVisible: true }),
		getAttrs
	};
	setContext(NAME, dropdownMenu);
	return {
		...dropdownMenu,
		updateOption: getOptionUpdater(dropdownMenu.options)
	};
}

export function setSubMenuCtx(props: DropdownSubmenuProps) {
	const { SUB_NAME } = getMenuData();
	const {
		builders: { createSubmenu },
		getAttrs
	} = getCtx();
	const sub = { ...createSubmenu(removeUndefined(props)), getAttrs };
	setContext(SUB_NAME, sub);
	return {
		...sub,
		updateOption: getOptionUpdater(sub.options)
	};
}

export function setRadioGroupCtx(props: DropdownRadioGroupProps) {
	const { RADIO_GROUP_NAME } = getMenuData();
	const {
		builders: { createMenuRadioGroup },
		getAttrs
	} = getCtx();
	const radioGroup = createMenuRadioGroup(props);
	setContext(RADIO_GROUP_NAME, { ...radioGroup, getAttrs });
	return {
		...radioGroup,
		getAttrs
	};
}

export function setRadioItem(value: string) {
	const { RADIO_ITEM_NAME, RADIO_GROUP_NAME } = getMenuData();
	const dropdownMenu = getContext<GetRadioGroupReturn>(RADIO_GROUP_NAME);
	setContext(RADIO_ITEM_NAME, { ...dropdownMenu, value });
	return {
		...dropdownMenu,
		value
	};
}

export function getRadioIndicator() {
	const { RADIO_ITEM_NAME } = getMenuData();
	const radioItem = getContext<GetRadioItem>(RADIO_ITEM_NAME);
	return {
		...radioItem
	};
}

export function getSubTrigger() {
	const { SUB_NAME } = getMenuData();
	const submenu = getContext<GetSubReturn>(SUB_NAME);
	return submenu;
}

export function getSubmenuCtx() {
	const { SUB_NAME } = getMenuData();
	return getContext<GetSubReturn>(SUB_NAME);
}

export function setCheckboxItem(props: DropdownCheckboxItemProps) {
	const { CHECKBOX_ITEM_NAME } = getMenuData();
	const {
		builders: { createCheckboxItem },
		getAttrs
	} = getCtx();
	const checkboxItem = createCheckboxItem(removeUndefined(props));
	setContext(CHECKBOX_ITEM_NAME, checkboxItem.states.checked);

	return {
		...checkboxItem,
		updateOption: getOptionUpdater(checkboxItem.options),
		getAttrs
	};
}

export function getCheckboxIndicator() {
	const { CHECKBOX_ITEM_NAME } = getMenuData();
	return getContext<CheckboxReturn["states"]["checked"]>(CHECKBOX_ITEM_NAME);
}
export function setGroupCtx() {
	const { GROUP_NAME } = getMenuData();
	const {
		elements: { group },
		getAttrs
	} = getCtx();
	const id = generateId();
	setContext(GROUP_NAME, id);
	return { group, id, getAttrs };
}

export function getGroupLabel() {
	const { GROUP_NAME } = getMenuData();
	const id = getContext<string>(GROUP_NAME) ?? generateId();
	const {
		elements: { groupLabel },
		getAttrs
	} = getCtx();
	return { groupLabel, id, getAttrs };
}

export function setArrow(size = 8) {
	const menu = getCtx();
	menu.options.arrowSize.set(size);
	return menu;
}

export function updatePositioning(props: FloatingProps) {
	const defaultPlacement = {
		side: "bottom",
		align: "center"
	} satisfies FloatingProps;
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}

export function updateSubPositioning(props: FloatingProps) {
	const defaultSubPlacement = {
		side: "right",
		align: "start"
	} satisfies FloatingProps;

	const withDefaults = { ...defaultSubPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getSubmenuCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
