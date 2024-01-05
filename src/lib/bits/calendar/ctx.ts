import { createCalendar, type CreateCalendarProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

export function getCalendarData() {
	const NAME = "calendar" as const;
	const PARTS = [
		"root",
		"prev-button",
		"next-button",
		"heading",
		"grid",
		"day",
		"header",
		"grid-head",
		"head-cell",
		"grid-body",
		"cell",
		"grid-row"
	] as const;

	return { NAME, PARTS };
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx<Multiple extends boolean>(props: CreateCalendarProps<Multiple>) {
	const { NAME, PARTS } = getCalendarData();
	const getAttrs = createBitAttrs(NAME, PARTS);

	const calendar = { ...createCalendar(removeUndefined(props)), getAttrs };

	setContext(NAME, calendar);

	return {
		...calendar,
		updateOption: getOptionUpdater(calendar.options)
	};
}

export function getCtx() {
	const { NAME } = getCalendarData();
	return getContext<GetReturn>(NAME);
}
