import { createProgress, type CreateProgressProps } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

function getProgressData() {
	const NAME = "progress" as const;
	const PARTS = ["root"] as const;

	return {
		NAME,
		PARTS
	};
}

export function setCtx(props: CreateProgressProps) {
	const { NAME, PARTS } = getProgressData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const progress = { ...createProgress(removeUndefined(props)), getAttrs };

	return {
		...progress,
		updateOption: getOptionUpdater(progress.options)
	};
}
