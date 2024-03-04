import { type CreateScrollAreaProps, createScrollArea } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

function getScrollAreaData() {
	const NAME = "scroll-area" as const;
	const PARTS = [
		"scrollbar-x",
		"scrollbar-y",
		"thumb-x",
		"thumb-y",
		"viewport",
		"content",
		"root",
		"corner",
	] as const;

	return { NAME, PARTS };
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateScrollAreaProps) {
	const { NAME, PARTS } = getScrollAreaData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const scrollArea = { ...createScrollArea(removeUndefined(props)), getAttrs };
	setContext(NAME, scrollArea);
	return {
		...scrollArea,
		updateOption: getOptionUpdater(scrollArea.options),
	};
}

export function getCtx() {
	const { NAME } = getScrollAreaData();
	return getContext<GetReturn>(NAME);
}
