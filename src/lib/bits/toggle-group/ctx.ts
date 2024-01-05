import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createToggleGroup, type CreateToggleGroupProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

function getToggleGroupData() {
	const NAME = "toggle-group" as const;
	const PARTS = ["root", "item"] as const;
	return {
		NAME,
		PARTS
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx<T extends "single" | "multiple">(props: CreateToggleGroupProps<T>) {
	const { NAME, PARTS } = getToggleGroupData();

	const getAttrs = createBitAttrs(NAME, PARTS);
	const toggleGroup = { ...createToggleGroup(removeUndefined(props)), getAttrs };
	setContext(NAME, toggleGroup);
	return {
		...toggleGroup,
		updateOption: getOptionUpdater(toggleGroup.options)
	};
}

export function getCtx() {
	const { NAME } = getToggleGroupData();
	return getContext<GetReturn>(NAME);
}
