import { type CreateRangeCalendarProps, createRangeCalendar } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

function getRangeCalendarData() {
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

export function setCtx(props: CreateRangeCalendarProps) {
	const { NAME, PARTS } = getRangeCalendarData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const rangeCalendar = { ...createRangeCalendar(removeUndefined(props)), getAttrs };
	setContext(NAME, rangeCalendar);
	return {
		...rangeCalendar,
		updateOption: getOptionUpdater(rangeCalendar.options)
	};
}

export function getCtx() {
	const { NAME } = getRangeCalendarData();
	return getContext<GetReturn>(NAME);
}
