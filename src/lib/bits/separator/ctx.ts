import { createSeparator, type CreateSeparatorProps } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "separator";
const PARTS = ["root"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

export function setCtx(props: CreateSeparatorProps) {
	const separator = createSeparator(removeUndefined(props));
	return {
		...separator,
		updateOption: getOptionUpdater(separator.options)
	};
}
