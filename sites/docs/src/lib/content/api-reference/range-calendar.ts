import type {
	RangeCalendarCellPropsWithoutHTML,
	RangeCalendarDayPropsWithoutHTML,
	RangeCalendarGridBodyPropsWithoutHTML,
	RangeCalendarGridHeadPropsWithoutHTML,
	RangeCalendarGridPropsWithoutHTML,
	RangeCalendarGridRowPropsWithoutHTML,
	RangeCalendarHeadCellPropsWithoutHTML,
	RangeCalendarHeaderPropsWithoutHTML,
	RangeCalendarHeadingPropsWithoutHTML,
	RangeCalendarNextButtonPropsWithoutHTML,
	RangeCalendarPrevButtonPropsWithoutHTML,
	RangeCalendarRootPropsWithoutHTML,
} from "bits-ui";
import { withChildProps } from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<RangeCalendarRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root range calendar component which contains all other calendar components.",
	props: {
		value: {
			type: {
				type: "DateRange",
				definition: "{ start: DateValue | undefined; end: DateValue | undefined; }",
			},
			description: "The selected date range.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateRange | undefined) => void",
			},
			description: "A function that is called when the selected date range changes.",
		},
		placeholder: {
			type: "DateValue",
			description:
				"The placeholder date, which is used to determine what month to display when no date range is selected. This updates as the user navigates the calendar, and can be used to programatically control the calendar's view.",
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
		weekdayFormat: {
			type: {
				type: C.ENUM,
				definition: enums("narrow", "short", "long"),
			},
			description:
				"The format to use for the weekday strings provided via the `weekdays` slot prop.",
			default: "'narrow'",
		},
		weekStartsOn: {
			type: C.NUMBER,
			description:
				"The day of the week to start the calendar on. 0 is Sunday, 1 is Monday, etc.",
			default: "0",
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
			type: "DateValue",
			description: "The maximum date that can be selected.",
		},
		minValue: {
			type: "DateValue",
			description: "The minimum date that can be selected.",
		},
		locale: {
			type: C.STRING,
			description: "The locale to use for formatting dates.",
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
		onStartValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: DateValue) => void",
			},
			description: "A callback function called when the start value changes.",
		},
		onEndValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: DateValue) => void",
			},
			description: "A callback function called when the end value changes.",
		},
		disableDaysOutsideMonth: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description:
				"Whether or not to disable the selection of days outside the current month.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
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

export const cell: APISchema<RangeCalendarCellPropsWithoutHTML> = {
	title: "Cell",
	description: "A cell in the calendar grid.",
	props: {
		date: {
			type: "DateValue",
			description: "The date for the cell.",
		},
		month: {
			type: "DateValue",
			description: "The current month the date is being displayed in.",
		},
		...withChildProps({ elType: "HTMLTableCellElement" }),
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

export const day: APISchema<RangeCalendarDayPropsWithoutHTML> = {
	title: "Day",
	description: "A day in the calendar grid.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
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
			name: "selection-start",
			description: "Present on the element when the date is the start of the selection.",
		},
		{
			name: "selection-end",
			description: "Present on the element when the date is the end of the selection.",
		},
		{
			name: "highlighted",
			description:
				"Present on the element when the date is in the range as its still being selected.",
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

export const grid: APISchema<RangeCalendarGridPropsWithoutHTML> = {
	title: "Grid",
	description: "The grid of dates in the calendar, typically representing a month.",
	props: withChildProps({ elType: "HTMLTableElement" }),
	dataAttributes: [
		{
			name: "calendar-grid",
			description: "Present on the grid element.",
		},
	],
};

export const gridBody: APISchema<RangeCalendarGridBodyPropsWithoutHTML> = {
	title: "GridBody",
	description: "The body of the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableSectionElement" }),
	dataAttributes: [
		{
			name: "calendar-grid-body",
			description: "Present on the grid body element.",
		},
	],
};

export const gridHead: APISchema<RangeCalendarGridHeadPropsWithoutHTML> = {
	title: "GridHead",
	description: "The head of the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableSectionElement" }),
	dataAttributes: [
		{
			name: "calendar-grid-head",
			description: "Present on the grid head element.",
		},
	],
};

export const gridRow: APISchema<RangeCalendarGridRowPropsWithoutHTML> = {
	title: "GridRow",
	description: "A row in the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableRowElement" }),
	dataAttributes: [
		{
			name: "calendar-grid-row",
			description: "Present on the grid row element.",
		},
	],
};

export const headCell: APISchema<RangeCalendarHeadCellPropsWithoutHTML> = {
	title: "HeadCell",
	description: "A cell in the head of the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableCellElement" }),
	dataAttributes: [
		{
			name: "calendar-head-cell",
			description: "Present on the head cell element.",
		},
	],
};

export const header: APISchema<RangeCalendarHeaderPropsWithoutHTML> = {
	title: "Header",
	description: "The header of the calendar.",
	props: withChildProps({ elType: "HTMLElement" }),
	dataAttributes: [
		{
			name: "calendar-header",
			description: "Present on the header element.",
		},
	],
};

export const heading: APISchema<RangeCalendarHeadingPropsWithoutHTML> = {
	title: "Heading",
	description: "The heading of the calendar.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "calendar-heading",
			description: "Present on the heading element.",
		},
	],
};

export const nextButton: APISchema<RangeCalendarNextButtonPropsWithoutHTML> = {
	title: "NextButton",
	description: "The next button of the calendar.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		{
			name: "calendar-next-button",
			description: "Present on the next button element.",
		},
	],
};

export const prevButton: APISchema<RangeCalendarPrevButtonPropsWithoutHTML> = {
	title: "PrevButton",
	description: "The previous button of the calendar.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		{
			name: "calendar-prev-button",
			description: "Present on the prev button element.",
		},
	],
};

export const rangeCalendar = [
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
