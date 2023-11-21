import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	type ContextMenu as ContextMenuReturn,
	createContextMenu,
	type CreateContextMenuProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { getPositioningUpdater, type PositioningProps } from "../floating/helpers.js";
import type { FloatingConfig } from "../floating/floating-config.js";

const NAME = "menu";

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

const defaultPlacement = {
	side: "bottom",
	align: "start"
} satisfies PositioningProps;

export function updatePositioning(props: PositioningProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies PositioningProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
