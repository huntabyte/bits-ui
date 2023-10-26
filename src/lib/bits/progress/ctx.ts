import { createProgress, type CreateProgressProps } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "progress";
const PARTS = ["root"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

export function setCtx(props: CreateProgressProps) {
	const progress = createProgress(removeUndefined(props));

	return {
		...progress,
		updateOption: getOptionUpdater(progress.options)
	};
}
