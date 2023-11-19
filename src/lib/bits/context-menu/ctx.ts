import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";
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

const NAME = "context-menu";
const SUB_NAME = "context-menu-submenu";
const RADIO_GROUP_NAME = "context-menu-radiogroup";
const CHECKBOX_ITEM_NAME = "context-menu-checkboxitem";
const RADIO_ITEM_NAME = "context-menu-radioitem";
const GROUP_NAME = "context-menu-group";

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

export const getAttrs = createBitAttrs("menu", PARTS);

type GetReturn = ContextMenuReturn;
type GetSubReturn = ContextSubmenuReturn;
type GetRadioReturn = ContextRadioGroupReturn;

export function setCtx(props: CreateContextMenuProps) {
	const contextMenu = createContextMenu(removeUndefined(props));
	setContext(NAME, contextMenu);
	return {
		...contextMenu,
		updateOption: getOptionUpdater(contextMenu.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function setSubMenuCtx(props: CreateContextSubmenuProps) {
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

export function getSubMenuCtx() {
	return getContext<GetSubReturn>(SUB_NAME);
}

export function setRadioGroupCtx(props: CreateContextMenuRadioGroupProps) {
	const {
		builders: { createMenuRadioGroup }
	} = getCtx();
	const radioGroup = createMenuRadioGroup(removeUndefined(props));
	setContext(RADIO_GROUP_NAME, radioGroup);
	return radioGroup;
}

function getRadioGroupCtx() {
	return getContext<GetRadioReturn>(RADIO_GROUP_NAME);
}

export function setRadioItem(value: string) {
	const radioGroup = getRadioGroupCtx();
	setContext(RADIO_ITEM_NAME, {
		isChecked: radioGroup.helpers.isChecked,
		value
	});
	return radioGroup;
}

export function getRadioIndicator() {
	return getContext<{
		isChecked: Readable<(itemValue: string) => boolean>;
		value: string;
	}>(RADIO_ITEM_NAME);
}

export function getContent(sideoffset = 5) {
	const menu = getCtx();

	menu.options.positioning.update((prev) => ({ ...prev, gutter: sideoffset }));

	return menu;
}

export function getSubContent(sideOffset = -1) {
	const submenu = getSubMenuCtx();
	const {
		options: { positioning }
	} = submenu;
	positioning.update((prev) => ({ ...prev, gutter: sideOffset }));
	return submenu;
}

export function setCheckboxItem(props: ContextCheckboxItemProps) {
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

export function setGroup() {
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
