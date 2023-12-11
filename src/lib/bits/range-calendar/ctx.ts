import {
	type RangeCalendar as RangeCalendarReturn,
	type CreateRangeCalendarProps,
	createRangeCalendar
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "calendar";
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

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = RangeCalendarReturn;

export function setCtx(props: CreateRangeCalendarProps) {
	const rangeCalendar = createRangeCalendar(removeUndefined(props));
	setContext(NAME, rangeCalendar);
	return {
		...rangeCalendar,
		updateOption: getOptionUpdater(rangeCalendar.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
