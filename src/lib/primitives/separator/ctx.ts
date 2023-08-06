import { createSeparator, type CreateSeparatorProps } from "@melt-ui/svelte";
import { getOptionUpdater, removeUndefined } from "$internal/index.js";

export const ctx = {
	get
};

function get(props: CreateSeparatorProps) {
	const separator = createSeparator(removeUndefined(props));
	return {
		...separator,
		updateOption: getOptionUpdater(separator.options)
	};
}
