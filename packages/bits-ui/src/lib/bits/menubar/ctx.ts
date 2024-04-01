import {
	createMenubar,
	type CreateMenubarProps as MenubarProps,
	type CreateMenubarSubmenuProps,
	type CreateMenubarMenuProps,
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";
import { getSubmenuCtx } from "../menu/ctx.js";

function getMenubarData() {
	const NAME = "menubar" as const;
	const MENU_NAME = "menu" as const;
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
		"trigger",
	] as const;

	return {
		NAME,
		MENU_NAME,
		SUB_NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
type GetMenuReturn = Omit<ReturnType<typeof setMenuCtx>, "updateOption">;
type GetSubmenuReturn = Omit<ReturnType<typeof setSubMenuCtx>, "updateOption">;

export function setCtx(props: MenubarProps) {
	const { NAME, PARTS, MENU_NAME } = getMenubarData();
	const getMenubarAttrs = createBitAttrs(NAME, ["root"]);
	const getAttrs = createBitAttrs(MENU_NAME, PARTS);
	const menubar = { ...createMenubar(removeUndefined(props)), getAttrs, getMenubarAttrs };
	setContext(NAME, menubar);

	return {
		...menubar,
		updateOption: getOptionUpdater(menubar.options),
	};
}
export function getCtx() {
	const { NAME } = getMenubarData();
	return getContext<GetReturn>(NAME);
}

export function setMenuCtx(props: CreateMenubarMenuProps) {
	const { MENU_NAME } = getMenubarData();
	const {
		builders: { createMenu },
		getAttrs,
	} = getCtx();

	const menu = { ...createMenu({ ...removeUndefined(props), forceVisible: false }), getAttrs };
	setContext(MENU_NAME, menu);
	return {
		...menu,
		updateOption: getOptionUpdater(menu.options),
	};
}

export function getMenuCtx() {
	const { MENU_NAME } = getMenubarData();
	return getContext<GetMenuReturn>(MENU_NAME);
}

export function setSubMenuCtx(props: CreateMenubarSubmenuProps) {
	const { SUB_NAME } = getMenubarData();
	const {
		builders: { createSubmenu },
		getAttrs,
	} = getMenuCtx();
	const sub = { ...createSubmenu(removeUndefined(props)), getAttrs };
	setContext(SUB_NAME, sub);
	return {
		...sub,
		updateOption: getOptionUpdater(sub.options),
	};
}
export function getSubMenuCtx() {
	const { SUB_NAME } = getMenubarData();
	return getContext<GetSubmenuReturn>(SUB_NAME);
}

const defaultPlacement = {
	side: "bottom",
	align: "center",
} satisfies FloatingProps;

export function updatePositioning(props: FloatingProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning },
	} = getMenuCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}

const defaultSubPlacement = {
	side: "right",
	align: "start",
} satisfies FloatingProps;

export function updateSubPositioning(props: FloatingProps) {
	const withDefaults = { ...defaultSubPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning },
	} = getSubmenuCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
