import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createToggle, type CreateToggleProps, type Toggle as ToggleReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "toggle";
const PARTS = ["root", "input"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	get,
	getAttrs
};

type GetReturn = ToggleReturn;

function set(props: CreateToggleProps) {
	const toggle = createToggle(removeUndefined(props));
	setContext(NAME, toggle);
	return {
		...toggle,
		updateOption: getOptionUpdater(toggle.options)
	};
}
function get() {
	return getContext<GetReturn>(NAME);
}
