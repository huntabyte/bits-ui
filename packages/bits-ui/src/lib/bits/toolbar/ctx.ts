import {
	type CreateToolbarGroupProps as ToolbarGroupProps,
	type CreateToolbarProps as ToolbarProps,
	createToolbar,
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getToolbarData() {
	const NAME = "toolbar" as const;
	const GROUP_NAME = "toolbar-group";
	const PARTS = ["root", "button", "link", "group", "group-item"] as const;
	return {
		NAME,
		GROUP_NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;
type GetGroupReturn = Omit<ReturnType<typeof setGroupCtx>, "updateOption">;

export function setCtx(props: ToolbarProps) {
	const { NAME, PARTS } = getToolbarData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const toolbar = { ...createToolbar(removeUndefined(props)), getAttrs };
	setContext(NAME, toolbar);
	return {
		...toolbar,
		updateOption: getOptionUpdater(toolbar.options),
	};
}

export function setGroupCtx<T extends "single" | "multiple">(props: ToolbarGroupProps<T>) {
	const {
		builders: { createToolbarGroup },
		getAttrs,
	} = getCtx();
	const group = { ...createToolbarGroup(removeUndefined(props)), getAttrs };
	const { GROUP_NAME } = getToolbarData();
	setContext(GROUP_NAME, group);
	return {
		...group,
		updateOption: getOptionUpdater(group.options),
	};
}

export function getCtx() {
	const { NAME } = getToolbarData();
	return getContext<GetReturn>(NAME);
}

export function getGroupCtx() {
	const { GROUP_NAME } = getToolbarData();
	return getContext<GetGroupReturn>(GROUP_NAME);
}
