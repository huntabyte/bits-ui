import { createSeparator, type CreateSeparatorProps } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getSeparatorData() {
	const NAME = "separator" as const;
	const PARTS = ["root"] as const;
	return {
		NAME,
		PARTS,
	};
}

export function setCtx(props: CreateSeparatorProps) {
	const { NAME, PARTS } = getSeparatorData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const separator = { ...createSeparator(removeUndefined(props)), getAttrs };
	return {
		...separator,
		updateOption: getOptionUpdater(separator.options),
	};
}
