import type { APISchema } from "@/types";
import * as C from "@/content/constants.js";
import { asChild } from "@/content/api-reference/helpers.js";
import type * as RangeCalendar from "$lib/bits/range-calendar/_types.js";

const root: APISchema<RangeCalendar.Props> = {
	title: "Root",
	description: "The root range calendar component which contains all other calendar components.",
	props: {
		value: {
			type: {
				type: "DateRange",
				definition: "{ start: DateValue | undefined; end: DateValue | undefined; }"
			},
			description: "The selected date range."
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateRange | undefined) => void"
			},
			description: "A function that is called when the selected date range changes."
		},
		placeholder: {
			type: "DateValue",
			description:
				"The placeholder date, which is used to determine what month to display when no date range is selected. This updates as the user navigates the calendar, and can be used to programatically control the calendar's view."
		},
		onPlaceholderChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => void"
			},
			description: "A function that is called when the placeholder date changes."
		},
		pagedNavigation: {
			type: C.BOOLEAN,
			description:
				"Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.",
			default: C.FALSE
		},
		preventDeselect: {
			type: C.BOOLEAN,
			description:
				"Whether or not to prevent the user from deselecting a date without selecting another date first.",
			default: C.FALSE
		},
		weekStartsOn: {
			type: C.NUMBER,
			description: "The day of the week to start the calendar on. 0 is Sunday, 1 is Monday, etc.",
			default: "0"
		},
		calendarLabel: {
			type: C.STRING,
			description: "The accessible label for the calendar."
		},
		fixedWeeks: {
			type: C.BOOLEAN,
			description: "Whether or not to always display 6 weeks in the calendar.",
			default: C.FALSE
		},
		isDateDisabled: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean"
			},
			description: "A function that returns whether or not a date is disabled."
		},
		isDateUnavailable: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean"
			},
			description: "A function that returns whether or not a date is unavailable."
		},
		maxValue: {
			type: "DateValue",
			description: "The maximum date that can be selected."
		},
		minValue: {
			type: "DateValue",
			description: "The minimum date that can be selected."
		},
		locale: {
			type: C.STRING,
			description: "The locale to use for formatting dates."
		},
		numberOfMonths: {
			type: C.NUMBER,
			description: "The number of months to display at once.",
			default: "1"
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled."
		},
		readonly: {
			type: C.BOOLEAN,
			description: "Whether or not the calendar is readonly.",
			default: C.FALSE
		},
		asChild
	},
	dataAttributes: [
		{
			name: "invalid",
			description: "Present on the root element when the calendar is invalid."
		},
		{
			name: "disabled",
			description: "Present on the root element when the calendar is disabled."
		},
		{
			name: "readonly",
			description: "Present on the root element when the calendar is readonly."
		},
		{
			name: "calendar-root",
			description: "Present on the root element."
		}
	]
};

const cell: APISchema<RangeCalendar.CellProps> = {
	title: "Cell",
	description: "A cell in the calendar grid.",
	props: {
		asChild,
		date: {
			type: "DateValue",
			description: "The date for the cell."
		}
	},
	dataAttributes: [
		{
			name: "disabled",
			description: "Present on the element when the date is disabled."
		},
		{
			name: "calendar-cell",
			description: "Present on the cell element."
		}
	]
};

const date: APISchema<RangeCalendar.DateProps> = {
	title: "Date",
	description: "A date in the calendar grid.",
	props: {
		asChild,
		date: {
			type: "DateValue",
			description: "The date for the cell."
		},
		month: {
			type: "DateValue",
			description: "The current month the date is being displayed in."
		}
	},
	dataAttributes: [
		{
			name: "disabled",
			value: "",
			description: "Present on the element when the date is disabled."
		},
		{
			name: "selected",
			value: "",
			description: "Present on the element when the date is selected."
		},
		{
			name: "unavailable",
			value: "",
			description: "Present on the element when the date is unavailable."
		},
		{
			name: "value",
			value: 'The date in the format "YYYY-MM-DD".'
		},
		{
			name: "today",
			description: "Present on the element when the date is today."
		},
		{
			name: "outside-month",
			description: "Present on the element when the date is outside the current month."
		},
		{
			name: "outside-visible-months",
			description: "Present on the element when the date is outside the visible months."
		},
		{
			name: "selection-start",
			description: "Present on the element when the date is the start of the selection."
		},
		{
			name: "selection-end",
			description: "Present on the element when the date is the end of the selection."
		},
		{
			name: "highlighted",
			description:
				"Present on the element when the date is in the range as its still being selected."
		},
		{
			name: "focused",
			description: "Present on the element when the date is focused."
		},
		{
			name: "calendar-date",
			description: "Present on the date element."
		}
	]
};

const grid: APISchema<RangeCalendar.GridProps> = {
	title: "Grid",
	description: "The grid of dates in the calendar, typically representing a month.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-grid",
			description: "Present on the grid element."
		}
	]
};

const gridBody: APISchema<RangeCalendar.GridBodyProps> = {
	title: "GridBody",
	description: "The body of the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-grid-body",
			description: "Present on the grid body element."
		}
	]
};

const gridHead: APISchema<RangeCalendar.GridHeadProps> = {
	title: "GridHead",
	description: "The head of the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-grid-head",
			description: "Present on the grid head element."
		}
	]
};

const gridRow: APISchema<RangeCalendar.GridRowProps> = {
	title: "GridRow",
	description: "A row in the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-grid-row",
			description: "Present on the grid row element."
		}
	]
};

const headCell: APISchema<RangeCalendar.HeadCellProps> = {
	title: "HeadCell",
	description: "A cell in the head of the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-head-cell",
			description: "Present on the head cell element."
		}
	]
};

const header: APISchema<RangeCalendar.HeaderProps> = {
	title: "Header",
	description: "The header of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-header",
			description: "Present on the header element."
		}
	]
};

const heading: APISchema<RangeCalendar.HeadingProps> = {
	title: "Heading",
	description: "The heading of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-heading",
			description: "Present on the heading element."
		}
	]
};

const nextButton: APISchema<RangeCalendar.NextButtonProps> = {
	title: "NextButton",
	description: "The next button of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-next-button",
			description: "Present on the next button element."
		}
	]
};

const prevButton: APISchema<RangeCalendar.PrevButtonProps> = {
	title: "PrevButton",
	description: "The previous button of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "calendar-prev-button",
			description: "Present on the prev button element."
		}
	]
};

export const rangeCalendar = [
	root,
	header,
	heading,
	nextButton,
	prevButton,
	cell,
	date,
	grid,
	gridBody,
	gridHead,
	gridRow,
	headCell
];