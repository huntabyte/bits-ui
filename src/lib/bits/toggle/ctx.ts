import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createToggle, type CreateToggleProps, type Toggle as ToggleReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "toggle";
const PARTS = ["root", "input"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = ToggleReturn;

export function setCtx(props: CreateToggleProps) {
	const toggle = createToggle(removeUndefined(props));
	setContext(NAME, toggle);
	return {
		...toggle,
		updateOption: getOptionUpdater(toggle.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
