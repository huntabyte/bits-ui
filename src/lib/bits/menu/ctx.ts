import {
	createBitAttrs,
	generateId,
	getOptionUpdater,
	removeUndefined
} from "$lib/internal/index.js";
import type {
	ContextMenu as ContextMenuReturn,
	ContextMenuRadioGroup as ContextRadioGroupReturn,
	ContextMenuSubmenu as ContextSubmenuReturn,
	Checkbox as CheckboxReturn,
	CreateContextMenuCheckboxItemProps as ContextCheckboxItemProps,
	CreateContextMenuRadioGroupProps,
	CreateContextSubmenuProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Readable, Writable } from "svelte/store";
import { getPositioningUpdater, type PositioningProps } from "../floating/helpers.js";

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
	"separator",
	"sub-content",
	"sub-trigger",
	"trigger"
] as const;

export const getAttrs = createBitAttrs("menu", PARTS);

type GetReturn = ContextMenuReturn;
type GetSubReturn = ContextSubmenuReturn;
type GetRadioReturn = ContextRadioGroupReturn;

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

const defaultPlacement = {
	side: "bottom",
	align: "center"
} satisfies PositioningProps;

export function updatePositioning(props: PositioningProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies PositioningProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}

const defaultSubPlacement = {
	side: "right",
	align: "start"
} satisfies PositioningProps;

export function updateSubPositioning(props: PositioningProps) {
	const withDefaults = { ...defaultSubPlacement, ...props } satisfies PositioningProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
