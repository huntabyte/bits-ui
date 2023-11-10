import {
	createCalendar,
	type Calendar as CalendarReturn,
	type CreateCalendarProps
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";

const NAME = "calendar";
const PARTS = ["root", "prev-button", "next-button", "heading", "grid", "cell"];

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = CalendarReturn;

export function setCtx(props: CreateCalendarProps) {
	const calendar = createCalendar(removeUndefined(props));
	setContext(NAME, calendar);
	return {
		...calendar,
		updateOption: getOptionUpdater(calendar.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}
