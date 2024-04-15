import type {
	CalendarCellPropsWithoutHTML,
	CalendarDayPropsWithoutHTML,
	CalendarGridBodyPropsWithoutHTML,
	CalendarGridHeadPropsWithoutHTML,
	CalendarGridPropsWithoutHTML,
	CalendarGridRowPropsWithoutHTML,
	CalendarHeadCellPropsWithoutHTML,
	CalendarHeaderPropsWithoutHTML,
	CalendarHeadingPropsWithoutHTML,
	CalendarNextButtonPropsWithoutHTML,
	CalendarPrevButtonPropsWithoutHTML,
	CalendarPropsWithoutHTML,
} from "bits-ui";
import { attrsSlotProp, builderAndAttrsSlotProps, domElProps } from "./helpers.js";
import { enums, monthsSlotProp, weekdaysSlotProp } from "$lib/content/api-reference/helpers.js";
import { dateValueProp } from "$lib/content/api-reference/extended-types/index.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<CalendarPropsWithoutHTML> = {
	title: "Root",
	description: "The root calendar component which contains all other calendar components.",
	props: {
		value: {
			type: dateValueProp,
			description: "The selected date.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue | undefined) => void",
			},
			description: "A function that is called when the selected date changes.",
		},
		placeholder: {
			type: dateValueProp,
			description:
				"The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programatically control the calendar's view.",
		},
		onPlaceholderChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => void",
			},
			description: "A function that is called when the placeholder date changes.",
		},
		pagedNavigation: {
			type: C.BOOLEAN,
			description:
				"Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.",
			default: C.FALSE,
		},
		preventDeselect: {
			type: C.BOOLEAN,
			description:
				"Whether or not to prevent the user from deselecting a date without selecting another date first.",
			default: C.FALSE,
		},
		weekStartsOn: {
			type: C.NUMBER,
			description:
				"The day of the week to start the calendar on. 0 is Sunday, 1 is Monday, etc.",
			default: "0",
		},
		weekdayFormat: {
			type: {
				type: C.ENUM,
				definition: enums("narrow", "short", "long"),
			},
			description:
				"The format to use for the weekday strings provided via the `weekdays` slot prop.",
			default: "'narrow'",
		},
		calendarLabel: {
			type: C.STRING,
			description: "The accessible label for the calendar.",
		},
		fixedWeeks: {
			type: C.BOOLEAN,
			description: "Whether or not to always display 6 weeks in the calendar.",
			default: C.FALSE,
		},
		isDateDisabled: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean",
			},
			description: "A function that returns whether or not a date is disabled.",
		},
		isDateUnavailable: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean",
			},
			description: "A function that returns whether or not a date is unavailable.",
		},
		maxValue: {
			type: dateValueProp,
			description: "The maximum date that can be selected.",
		},
		minValue: {
			type: dateValueProp,
			description: "The minimum date that can be selected.",
		},
		locale: {
			type: C.STRING,
			description: "The locale to use for formatting dates.",
		},
		multiple: {
			type: C.BOOLEAN,
			description: "Whether or not multiple dates can be selected.",
			default: C.FALSE,
		},
		numberOfMonths: {
			type: C.NUMBER,
			description: "The number of months to display at once.",
			default: "1",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled.",
		},
		readonly: {
			type: C.BOOLEAN,
			description: "Whether or not the calendar is readonly.",
			default: C.FALSE,
		},
		initialFocus: {
			type: C.BOOLEAN,
			description:
				"If `true`, the calendar will focus the selected day, today, or the first day of the month in that order depending on what is visible when the calendar is mounted.",
			default: C.FALSE,
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: {
		months: monthsSlotProp,
		weekdays: weekdaysSlotProp,
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "invalid",
			description: "Present on the root element when the calendar is invalid.",
		},
		{
			name: "disabled",
			description: "Present on the root element when the calendar is disabled.",
		},
		{
			name: "readonly",
			description: "Present on the root element when the calendar is readonly.",
		},
		{
			name: "calendar-root",
			description: "Present on the root element.",
		},
	],
};

export const cell: APISchema<CalendarCellPropsWithoutHTML> = {
	title: "Cell",
	description: "A cell in the calendar grid.",
	props: {
		date: {
			type: dateValueProp,
			description: "The date for the cell.",
		},
		...domElProps("HTMLTableCellElement"),
	},
	slotProps: {
		attrs: attrsSlotProp,
	},
	dataAttributes: [
		{
			name: "disabled",
			description: "Present on the element when the date is disabled.",
		},
		{
			name: "calendar-cell",
			description: "Present on the cell element.",
		},
	],
};

export const day: APISchema<CalendarDayPropsWithoutHTML> = {
	title: "Day",
	description: "A day in the calendar grid.",
	props: {
		date: {
			type: dateValueProp,
			description: "The date for the cell.",
		},
		month: {
			type: dateValueProp,
			description: "The current month the date is being displayed in.",
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: {
		disabled: {
			description: "Whether or not the date is disabled.",
			type: C.BOOLEAN,
		},
		unavailable: {
			description: "Whether or not the date is unavailable.",
			type: C.BOOLEAN,
		},
		selected: {
			description: "Whether or not the date is selected.",
			type: C.BOOLEAN,
		},
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "disabled",
			description: "Present on the element when the date is disabled.",
		},
		{
			name: "selected",
			description: "Present on the element when the date is selected.",
		},
		{
			name: "unavailable",
			description: "Present on the element when the date is unavailable.",
		},
		{
			name: "value",
			description: 'The date in the format "YYYY-MM-DD".',
		},
		{
			name: "today",
			description: "Present on the element when the date is today.",
		},
		{
			name: "outside-month",
			description: "Present on the element when the date is outside the current month.",
		},
		{
			name: "outside-visible-months",
			description: "Present on the element when the date is outside the visible months.",
		},
		{
			name: "focused",
			description: "Present on the element when the date is focused.",
		},
		{
			name: "calendar-day",
			description: "Present on the day element.",
		},
	],
};

export const grid: APISchema<CalendarGridPropsWithoutHTML> = {
	title: "Grid",
	description: "The grid of dates in the calendar, typically representing a month.",
	props: domElProps("HTMLTableElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "calendar-grid",
			description: "Present on the grid element.",
		},
	],
};

export const gridBody: APISchema<CalendarGridBodyPropsWithoutHTML> = {
	title: "GridBody",
	description: "The body of the grid of dates in the calendar.",
	props: domElProps("HTMLTableSectionElement"),
	slotProps: { attrs: attrsSlotProp },
	dataAttributes: [
		{
			name: "calendar-grid-body",
			description: "Present on the grid body element.",
		},
	],
};

export const gridHead: APISchema<CalendarGridHeadPropsWithoutHTML> = {
	title: "GridHead",
	description: "The head of the grid of dates in the calendar.",
	props: domElProps("HTMLTableSectionElement"),
	slotProps: {
		attrs: attrsSlotProp,
	},
	dataAttributes: [
		{
			name: "calendar-grid-head",
			description: "Present on the grid head element.",
		},
	],
};

export const gridRow: APISchema<CalendarGridRowPropsWithoutHTML> = {
	title: "GridRow",
	description: "A row in the grid of dates in the calendar.",
	props: domElProps("HTMLTableRowElement"),
	slotProps: {
		attrs: attrsSlotProp,
	},
	dataAttributes: [
		{
			name: "calendar-grid-row",
			description: "Present on the grid row element.",
		},
	],
};

export const headCell: APISchema<CalendarHeadCellPropsWithoutHTML> = {
	title: "HeadCell",
	description: "A cell in the head of the grid of dates in the calendar.",
	props: domElProps("HTMLTableCellElement"),
	slotProps: {
		attrs: attrsSlotProp,
	},
	dataAttributes: [
		{
			name: "calendar-head-cell",
			description: "Present on the head cell element.",
		},
	],
};

export const header: APISchema<CalendarHeaderPropsWithoutHTML> = {
	title: "Header",
	description: "The header of the calendar.",
	props: domElProps("HTMLElement"),
	slotProps: {
		attrs: attrsSlotProp,
	},
	dataAttributes: [
		{
			name: "calendar-header",
			description: "Present on the header element.",
		},
	],
};

export const heading: APISchema<CalendarHeadingPropsWithoutHTML> = {
	title: "Heading",
	description: "The heading of the calendar.",
	props: domElProps("HTMLDivElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
		headingValue: {
			type: C.STRING,
			description: "The heading value.",
		},
	},
	dataAttributes: [
		{
			name: "calendar-heading",
			description: "Present on the heading element.",
		},
	],
};

export const nextButton: APISchema<CalendarNextButtonPropsWithoutHTML> = {
	title: "NextButton",
	description: "The next button of the calendar.",
	props: domElProps("HTMLButtonElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "calendar-next-button",
			description: "Present on the next button element.",
		},
	],
};

export const prevButton: APISchema<CalendarPrevButtonPropsWithoutHTML> = {
	title: "PrevButton",
	description: "The previous button of the calendar.",
	props: domElProps("HTMLButtonElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "calendar-prev-button",
			description: "Present on the prev button element.",
		},
	],
};

export const calendar = [
	root,
	header,
	heading,
	nextButton,
	prevButton,
	cell,
	day,
	grid,
	gridBody,
	gridHead,
	gridRow,
	headCell,
];
