import { type CreateScrollAreaProps, createScrollArea } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";
import type { Writable } from "svelte/store";

function getScrollAreaData() {
	const NAME = "scroll-area" as const;
	const SCROLLBAR_NAME = "scrollbar" as const;
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

	return { NAME, PARTS, SCROLLBAR_NAME };
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

export function setScrollbarOrientation(orientation: Writable<"horizontal" | "vertical">) {
	const { SCROLLBAR_NAME } = getScrollAreaData();
	return setContext(SCROLLBAR_NAME, orientation);
}

export function getScrollbarOrientation() {
	const { SCROLLBAR_NAME } = getScrollAreaData();
	return getContext<ReturnType<typeof setScrollbarOrientation>>(SCROLLBAR_NAME);
}
