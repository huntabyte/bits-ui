import { createProgress, type CreateProgressProps } from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

const NAME = "progress";
const PARTS = ["root"] as const;

const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	set,
	getAttrs
};

function set(props: CreateProgressProps) {
	const progress = createProgress(removeUndefined(props));

	return {
		...progress,
		updateOption: getOptionUpdater(progress.options)
	};
}
