import { getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createToggle, type CreateToggleProps, type Toggle as ToggleReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "Toggle";

export const ctx = {
	set,
	get
};

function set(props: CreateToggleProps) {
	const toggle = createToggle(removeUndefined(props));
	setContext(NAME, toggle);
	return {
		...toggle,
		updateOption: getOptionUpdater(toggle.options)
	};
}
function get() {
	return getContext<ToggleReturn>(NAME);
}
