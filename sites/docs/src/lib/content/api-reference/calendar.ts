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
	CalendarRootPropsWithoutHTML,
} from "bits-ui";
import DateMatcher from "./extended-types/shared/date-matcher.md";
import SingleOrMultiple from "./extended-types/shared/single-or-multiple.md";
import DateValueOrArray from "./extended-types/shared/date-value-or-array.md";
import DateValueChangeFn from "./extended-types/shared/date-value-change-fn.md";
import DatePlaceholderChangeFn from "./extended-types/shared/date-placeholder-change-fn.md";
import WeekdayFormat from "./extended-types/shared/weekday-format.md";

import {
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createStringProp,
	createUnionProp,
	withChildProps,
} from "./helpers.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<CalendarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root calendar component which contains all other calendar components.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "Whether or not multiple dates can be selected.",
			required: true,
			definition: SingleOrMultiple,
		}),
		value: createUnionProp({
			options: ["DateValue", "DateValue[]"],
			description:
				"The selected date(s). If `type` is `'single'`, this will be a `DateValue`. If `type` is `'multiple'`, this will be an array of `DateValue`s.",
			bindable: true,
			definition: DateValueOrArray,
		}),
		onValueChange: createFunctionProp({
			definition: DateValueChangeFn,
			description: "A function that is called when the selected date changes.",
		}),
		placeholder: {
			type: "DateValue",
			description:
				"The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programatically control the calendar's view.",
		},
		onPlaceholderChange: createFunctionProp({
			definition: DatePlaceholderChangeFn,
			description: "A function that is called when the placeholder date changes.",
		}),
		pagedNavigation: createBooleanProp({
			description:
				"Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.",
			default: C.FALSE,
		}),
		preventDeselect: createBooleanProp({
			description:
				"Whether or not to prevent the user from deselecting a date without selecting another date first.",
			default: C.FALSE,
		}),
		weekStartsOn: createNumberProp({
			description:
				"The day of the week to start the calendar on. 0 is Sunday, 1 is Monday, etc.",
			default: "0",
		}),
		weekdayFormat: createEnumProp({
			options: ["narrow", "short", "long"],
			definition: WeekdayFormat,
			description:
				"The format to use for the weekday strings provided via the `weekdays` slot prop.",
			default: "'narrow'",
		}),
		calendarLabel: createStringProp({
			description: "The accessible label for the calendar.",
		}),
		fixedWeeks: createBooleanProp({
			description: "Whether or not to always display 6 weeks in the calendar.",
			default: C.FALSE,
		}),
		isDateDisabled: createFunctionProp({
			definition: DateMatcher,
			description: "A function that returns whether or not a date is disabled.",
		}),
		isDateUnavailable: createFunctionProp({
			definition: DateMatcher,
			description: "A function that returns whether or not a date is unavailable.",
		}),
		maxValue: {
			type: "DateValue",
			description: "The maximum date that can be selected.",
			tooltipContent: "Learn more about the `DateValue` type.",
		},
		minValue: {
			type: "DateValue",
			description: "The minimum date that can be selected.",
		},
		locale: createStringProp({
			description: "The locale to use for formatting dates.",
			default: "'en'",
		}),
		numberOfMonths: createNumberProp({
			description: "The number of months to display at once.",
			default: "1",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the accordion is disabled.",
		}),
		readonly: createBooleanProp({
			description: "Whether or not the calendar is readonly.",
			default: C.FALSE,
		}),
		// initialFocus: {
		// 	type: C.BOOLEAN,
		// 	description:
		// 		"If `true`, the calendar will focus the selected day, today, or the first day of the month in that order depending on what is visible when the calendar is mounted.",
		// 	default: C.FALSE,
		// },
		disableDaysOutsideMonth: createBooleanProp({
			description: "Whether or not to disable days outside the current month.",
			default: C.FALSE,
		}),
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
});

export const cell = createApiSchema<CalendarCellPropsWithoutHTML>({
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
});

export const day = createApiSchema<CalendarDayPropsWithoutHTML>({
	title: "Day",
	description: "A day in the calendar grid.",
	props: withChildProps({ elType: "HTMLDivElement" }),
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
});

export const grid = createApiSchema<CalendarGridPropsWithoutHTML>({
	title: "Grid",
	description: "The grid of dates in the calendar, typically representing a month.",
	props: withChildProps({ elType: "HTMLTableElement" }),
	dataAttributes: [
		{
			name: "calendar-grid",
			description: "Present on the grid element.",
		},
	],
});

export const gridBody = createApiSchema<CalendarGridBodyPropsWithoutHTML>({
	title: "GridBody",
	description: "The body of the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableSectionElement" }),
	dataAttributes: [
		{
			name: "calendar-grid-body",
			description: "Present on the grid body element.",
		},
	],
});

export const gridHead = createApiSchema<CalendarGridHeadPropsWithoutHTML>({
	title: "GridHead",
	description: "The head of the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableSectionElement" }),
	dataAttributes: [
		{
			name: "calendar-grid-head",
			description: "Present on the grid head element.",
		},
	],
});

export const gridRow = createApiSchema<CalendarGridRowPropsWithoutHTML>({
	title: "GridRow",
	description: "A row in the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableRowElement" }),
	dataAttributes: [
		{
			name: "calendar-grid-row",
			description: "Present on the grid row element.",
		},
	],
});

export const headCell = createApiSchema<CalendarHeadCellPropsWithoutHTML>({
	title: "HeadCell",
	description: "A cell in the head of the grid of dates in the calendar.",
	props: withChildProps({ elType: "HTMLTableCellElement" }),
	dataAttributes: [
		{
			name: "calendar-head-cell",
			description: "Present on the head cell element.",
		},
	],
});

export const header = createApiSchema<CalendarHeaderPropsWithoutHTML>({
	title: "Header",
	description: "The header of the calendar.",
	props: withChildProps({ elType: "HTMLElement" }),
	dataAttributes: [
		{
			name: "calendar-header",
			description: "Present on the header element.",
		},
	],
});

export const heading = createApiSchema<CalendarHeadingPropsWithoutHTML>({
	title: "Heading",
	description: "The heading of the calendar.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "calendar-heading",
			description: "Present on the heading element.",
		},
	],
});

export const nextButton = createApiSchema<CalendarNextButtonPropsWithoutHTML>({
	title: "NextButton",
	description: "The next button of the calendar.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		{
			name: "calendar-next-button",
			description: "Present on the next button element.",
		},
	],
});

export const prevButton = createApiSchema<CalendarPrevButtonPropsWithoutHTML>({
	title: "PrevButton",
	description: "The previous button of the calendar.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		{
			name: "calendar-prev-button",
			description: "Present on the prev button element.",
		},
	],
});

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
