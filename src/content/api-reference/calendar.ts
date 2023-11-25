import type { APISchema } from "@/types";
import * as C from "@/content/constants.js";
import { asChild } from "@/content/api-reference/helpers.js";
import type * as Calendar from "$lib/bits/calendar/_types.js";

const root: APISchema<Calendar.Props> = {
	title: "Root",
	description: "The root calendar component which contains all other calendar components.",
	props: {
		value: {
			type: "DateValue",
			description: "The selected date."
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue | undefined) => void"
			},
			description: "A function that is called when the selected date changes."
		},
		placeholder: {
			type: "DateValue",
			description:
				"The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programatically control the calendar's view."
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
		multiple: {
			type: C.BOOLEAN,
			description: "Whether or not multiple dates can be selected.",
			default: C.FALSE
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
			name: "bits-calendar-root",
			description: "Present on the root element."
		}
	]
};

const cell: APISchema<Calendar.CellProps> = {
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
			name: "bits-calendar-cell",
			description: "Present on the cell element."
		}
	]
};

const date: APISchema<Calendar.DateProps> = {
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
			name: "focused",
			description: "Present on the element when the date is focused."
		},
		{
			name: "bits-calendar-date",
			description: "Present on the date element."
		}
	]
};

const grid: APISchema<Calendar.GridProps> = {
	title: "Grid",
	description: "The grid of dates in the calendar, typically representing a month.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-grid",
			description: "Present on the grid element."
		}
	]
};

const gridBody: APISchema<Calendar.GridBodyProps> = {
	title: "GridBody",
	description: "The body of the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-grid-body",
			description: "Present on the grid body element."
		}
	]
};

const gridHead: APISchema<Calendar.GridHeadProps> = {
	title: "GridHead",
	description: "The head of the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-grid-head",
			description: "Present on the grid head element."
		}
	]
};

const gridRow: APISchema<Calendar.GridRowProps> = {
	title: "GridRow",
	description: "A row in the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-grid-row",
			description: "Present on the grid row element."
		}
	]
};

const headCell: APISchema<Calendar.HeadCellProps> = {
	title: "HeadCell",
	description: "A cell in the head of the grid of dates in the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-head-cell",
			description: "Present on the head cell element."
		}
	]
};

const header: APISchema<Calendar.HeaderProps> = {
	title: "Header",
	description: "The header of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-header",
			description: "Present on the header element."
		}
	]
};

const heading: APISchema<Calendar.HeadingProps> = {
	title: "Heading",
	description: "The heading of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-heading",
			description: "Present on the heading element."
		}
	]
};

const nextButton: APISchema<Calendar.NextButtonProps> = {
	title: "NextButton",
	description: "The next button of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-next-button",
			description: "Present on the next button element."
		}
	]
};

const prevButton: APISchema<Calendar.PrevButtonProps> = {
	title: "PrevButton",
	description: "The previous button of the calendar.",
	props: {
		asChild
	},
	dataAttributes: [
		{
			name: "bits-calendar-prev-button",
			description: "Present on the prev button element."
		}
	]
};

export const calendar = [
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
