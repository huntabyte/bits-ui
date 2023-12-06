import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createToolbar,
	type Toolbar as ToolbarReturn,
	type ToolbarGroup as ToolbarGroupReturn,
	type CreateToolbarProps as ToolbarProps,
	type CreateToolbarGroupProps as ToolbarGroupProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "toolbar";
const GROUP_NAME = "toolbar-group";

const PARTS = ["root", "button", "link", "group", "group-item"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = ToolbarReturn;
type GetGroupReturn = ToolbarGroupReturn;

export function setCtx(props: ToolbarProps) {
	const toolbar = createToolbar(removeUndefined(props));
	setContext(NAME, toolbar);
	return {
		...toolbar,
		updateOption: getOptionUpdater(toolbar.options)
	};
}

export function setGroupCtx<T extends "single" | "multiple">(props: ToolbarGroupProps<T>) {
	const {
		builders: { createToolbarGroup }
	} = getCtx();
	const group = createToolbarGroup(removeUndefined(props));
	setContext(GROUP_NAME, group);
	return {
		...group,
		updateOption: getOptionUpdater(group.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function getGroupCtx() {
	return getContext<GetGroupReturn>(GROUP_NAME);
}
