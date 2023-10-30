import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import {
	createToggleGroup,
	type CreateToggleGroupProps,
	type ToggleGroup as ToggleGroupReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "toggle-group";
const PARTS = ["root", "item"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = ToggleGroupReturn;

export function setCtx<T extends "single" | "multiple">(props: CreateToggleGroupProps<T>) {
	const toggleGroup = createToggleGroup(removeUndefined(props));
	setContext(NAME, toggleGroup);
	return {
		...toggleGroup,
		updateOption: getOptionUpdater(toggleGroup.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
