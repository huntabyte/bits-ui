import {
	createMenubar,
	type Menubar as MenubarReturn,
	type CreateMenubarProps as MenubarProps,
	type MenubarMenu as MenubarMenuReturn,
	type CreateMenubarSubmenuProps,
	type CreateMenubarMenuProps,
	type MenubarMenuSubmenu as MenubarSubReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";
import { getSubmenuCtx } from "../menu/ctx";

const NAME = "menubar";
const MENU_NAME = "menu";
const SUB_NAME = "menu-submenu";

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

export const getMenubarAttrs = createBitAttrs(NAME, ["root"]);
export const getAttrs = createBitAttrs("menu", PARTS);

type GetReturn = MenubarReturn;
type GetMenuReturn = MenubarMenuReturn;
type GetSubmenuReturn = MenubarSubReturn;

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

const defaultPlacement = {
	side: "bottom",
	align: "center"
} satisfies FloatingProps;

export function updatePositioning(props: FloatingProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getMenuCtx();

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
