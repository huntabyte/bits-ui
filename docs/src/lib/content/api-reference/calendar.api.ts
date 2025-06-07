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
	CalendarMonthSelectPropsWithoutHTML,
	CalendarNextButtonPropsWithoutHTML,
	CalendarPrevButtonPropsWithoutHTML,
	CalendarRootPropsWithoutHTML,
	CalendarYearSelectPropsWithoutHTML,
} from "bits-ui";
import {
	CalendarMonthSelectChildrenSnippetProps,
	CalendarMonthSelectChildSnippetProps,
	CalendarMonthSelectFormatProp,
	CalendarOnValueChangeProp,
	CalendarRootChildrenSnippetProps,
	CalendarRootChildSnippetProps,
	CalendarValueProp,
	CalendarYearSelectChildrenSnippetProps,
	CalendarYearSelectChildSnippetProps,
	CalendarYearSelectFormatProp,
	DateMatcherProp,
	OnPlaceholderChangeProp,
	SingleOrMultipleProp,
	WeekdayFormatProp,
} from "./extended-types/shared/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createStringProp,
	createUnionProp,
	withChildProps,
	createPropSchema,
} from "./helpers.js";
import { dateValueProp } from "./extended-types/index.js";
import * as C from "$lib/content/constants.js";

const sharedCellDayAttrs = [
	createDataAttrSchema({
		name: "disabled",
		description: "Present when the day is disabled.",
	}),
	createDataAttrSchema({
		name: "unavailable",
		description: "Present when the day is unavailable.",
	}),
	createDataAttrSchema({
		name: "today",
		description: "Present when the day is today.",
	}),
	createDataAttrSchema({
		name: "outside-month",
		description: "Present when the day is outside the current month.",
	}),
	createDataAttrSchema({
		name: "outside-visible-months",
		description: "Present when the day is outside the visible months.",
	}),
	createDataAttrSchema({
		name: "focused",
		description: "Present when the day is focused.",
	}),
	createDataAttrSchema({
		name: "selected",
		description: "Present when the day is selected.",
	}),
	createDataAttrSchema({
		name: "value",
		description: 'The date in the format "YYYY-MM-DD".',
	}),
];

export const root = createApiSchema<CalendarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root calendar component which contains all other calendar components.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "Whether or not multiple dates can be selected.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: createUnionProp({
			options: ["DateValue", "DateValue[]"],
			description:
				"The selected date(s). If `type` is `'single'`, this will be a `DateValue`. If `type` is `'multiple'`, this will be an array of `DateValue`s.",
			bindable: true,
			definition: CalendarValueProp,
		}),
		onValueChange: createFunctionProp({
			definition: CalendarOnValueChangeProp,
			description: "A function that is called when the selected date changes.",
			stringDefinition: "(value: DateValue) => void | (value: DateValue[]) => void",
		}),
		placeholder: {
			type: dateValueProp,
			description:
				"The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programmatically control the calendar's view.",
		},
		onPlaceholderChange: createFunctionProp({
			definition: OnPlaceholderChangeProp,
			description: "A function that is called when the placeholder date changes.",
			stringDefinition: "(date: DateValue) => void",
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
				"An absolute day of the week to start the calendar on, regardless of locale. `0` is Sunday, `1` is Monday, etc. If not provided, the calendar will default to the locale's first day of the week.",
		}),
		weekdayFormat: createEnumProp({
			options: ["narrow", "short", "long"],
			definition: WeekdayFormatProp,
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
			definition: DateMatcherProp,
			description: "A function that returns whether or not a date is disabled.",
			stringDefinition: "(date: DateValue) => boolean",
		}),
		isDateUnavailable: createFunctionProp({
			definition: DateMatcherProp,
			description: "A function that returns whether or not a date is unavailable.",
			stringDefinition: "(date: DateValue) => boolean",
		}),
		maxValue: createPropSchema({
			type: dateValueProp,
			description: "The maximum date that can be selected.",
			tooltipContent: "Learn more about the `DateValue` type.",
		}),
		minValue: createPropSchema({
			type: dateValueProp,
			description: "The minimum date that can be selected.",
		}),
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
		initialFocus: createBooleanProp({
			description:
				"If `true`, the calendar will focus the selected day, today, or the first day of the month in that order depending on what is visible when the calendar is mounted.",
			default: C.FALSE,
		}),
		disableDaysOutsideMonth: createBooleanProp({
			description: "Whether or not to disable days outside the current month.",
			default: C.FALSE,
		}),
		maxDays: createNumberProp({
			description:
				"The maximum number of days that can be selected when the calendar is `'multiple'` type.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: CalendarRootChildSnippetProps,
			childrenDef: CalendarRootChildrenSnippetProps,
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the root element when the calendar is invalid.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present on the root element when the calendar is disabled.",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present on the root element when the calendar is readonly.",
		}),
		createDataAttrSchema({
			name: "calendar-root",
			description: "Present on the root element.",
		}),
	],
});

export function createCalendarCellSchema(isRange: boolean) {
	return createApiSchema<CalendarCellPropsWithoutHTML>({
		title: "Cell",
		description: "A cell in the calendar grid.",
		props: {
			date: createPropSchema({
				type: dateValueProp,
				description: "The date for the cell.",
			}),
			month: createPropSchema({
				type: dateValueProp,
				description: "The current month the date is being displayed in.",
			}),
			...withChildProps({ elType: "HTMLTableCellElement" }),
		},
		dataAttributes: [
			...sharedCellDayAttrs,
			createDataAttrSchema({
				name: isRange ? "range-calendar-cell" : "calendar-cell",
				description: "Present on the cell element.",
			}),
		],
	});
}

export const cell = createCalendarCellSchema(false);

export function createCalendarDaySchema(isRange: boolean) {
	return createApiSchema<CalendarDayPropsWithoutHTML>({
		title: "Day",
		description: "A day in the calendar grid.",
		props: withChildProps({ elType: "HTMLDivElement" }),
		dataAttributes: [
			...sharedCellDayAttrs,
			createDataAttrSchema({
				name: isRange ? "range-calendar-day" : "calendar-day",
				description: "Present on the day element.",
			}),
		],
	});
}

export const day = createCalendarDaySchema(false);

export function createCalendarGridSchema(isRange: boolean) {
	return createApiSchema<CalendarGridPropsWithoutHTML>({
		title: "Grid",
		description: "The grid of dates in the calendar, typically representing a month.",
		props: withChildProps({ elType: "HTMLTableElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the grid element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the grid element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-grid" : "calendar-grid",
				description: "Present on the grid element.",
			}),
		],
	});
}

export const grid = createCalendarGridSchema(false);

export function createCalendarGridBodySchema(isRange: boolean) {
	return createApiSchema<CalendarGridBodyPropsWithoutHTML>({
		title: "GridBody",
		description: "The body of the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableSectionElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the grid element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the grid element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-grid-body" : "calendar-grid-body",
				description: "Present on the grid body element.",
			}),
		],
	});
}

export const gridBody = createCalendarGridBodySchema(false);

export function createCalendarGridHeadSchema(isRange: boolean) {
	return createApiSchema<CalendarGridHeadPropsWithoutHTML>({
		title: "GridHead",
		description: "The head of the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableSectionElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the grid head element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the grid head element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-grid-head" : "calendar-grid-head",
				description: "Present on the grid head element.",
			}),
		],
	});
}

export const gridHead = createCalendarGridHeadSchema(false);

export function createCalendarGridRowSchema(isRange: boolean) {
	return createApiSchema<CalendarGridRowPropsWithoutHTML>({
		title: "GridRow",
		description: "A row in the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableRowElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the grid row element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the grid row element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-grid-row" : "calendar-grid-row",
				description: "Present on the grid row element.",
			}),
		],
	});
}

export const gridRow = createCalendarGridRowSchema(false);

export function createCalendarHeadCellSchema(isRange: boolean) {
	return createApiSchema<CalendarHeadCellPropsWithoutHTML>({
		title: "HeadCell",
		description: "A cell in the head of the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableCellElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the head cell element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the head cell element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-head-cell" : "calendar-head-cell",
				description: "Present on the head cell element.",
			}),
		],
	});
}

export const headCell = createCalendarHeadCellSchema(false);

export function createCalendarHeaderSchema(isRange: boolean) {
	return createApiSchema<CalendarHeaderPropsWithoutHTML>({
		title: "Header",
		description: "The header of the calendar.",
		props: withChildProps({ elType: "HTMLElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the header element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the header element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-header" : "calendar-header",
				description: "Present on the header element.",
			}),
		],
	});
}

export const header = createCalendarHeaderSchema(false);

export function createCalendarHeadingSchema(isRange: boolean) {
	return createApiSchema<CalendarHeadingPropsWithoutHTML>({
		title: "Heading",
		description: "The heading of the calendar.",
		props: withChildProps({ elType: "HTMLDivElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the heading element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: "readonly",
				description: "Present on the heading element when the calendar is readonly.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-heading" : "calendar-heading",
				description: "Present on the heading element.",
			}),
		],
	});
}

export const heading = createCalendarHeadingSchema(false);

export function createCalendarNextButtonSchema(isRange: boolean) {
	return createApiSchema<CalendarNextButtonPropsWithoutHTML>({
		title: "NextButton",
		description: "The next button of the calendar.",
		props: withChildProps({ elType: "HTMLButtonElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description:
					"Present on the next button element when the calendar or this button is disabled.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-next-button" : "calendar-next-button",
				description: "Present on the next button element.",
			}),
		],
	});
}

export const nextButton = createCalendarNextButtonSchema(false);

export function createCalendarPrevButtonSchema(isRange: boolean) {
	return createApiSchema<CalendarPrevButtonPropsWithoutHTML>({
		title: "PrevButton",
		description: "The previous button of the calendar.",
		props: withChildProps({ elType: "HTMLButtonElement" }),
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description:
					"Present on the prev button element when the calendar or this button is disabled.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-prev-button" : "calendar-prev-button",
				description: "Present on the prev button element.",
			}),
		],
	});
}

export const prevButton = createCalendarPrevButtonSchema(false);

export function createCalendarMonthSelectSchema(isRange: boolean) {
	return createApiSchema<CalendarMonthSelectPropsWithoutHTML>({
		title: "MonthSelect",
		description: "A select you can use to navigate to a specific month in the calendar view.",
		props: {
			months: createPropSchema({
				type: "number[]",
				description: "The month values to render in the select.",
				default: "[1-12]",
			}),

			monthFormat: createEnumProp({
				options: ["narrow", "short", "long", "numeric", "2-digit"],
				description:
					"The format to use for the month strings provided via the `months` slot prop.",
				default: "'narrow'",
				definition: CalendarMonthSelectFormatProp,
			}),
			...withChildProps({
				elType: "HTMLSelectElement",
				childDef: CalendarMonthSelectChildSnippetProps,
				childrenDef: CalendarMonthSelectChildrenSnippetProps,
			}),
		},
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the month select element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-month-select" : "calendar-month-select",
				description: "Present on the month select element.",
			}),
		],
	});
}

export const monthSelect = createCalendarMonthSelectSchema(false);

export function createCalendarYearSelectSchema(isRange: boolean) {
	return createApiSchema<CalendarYearSelectPropsWithoutHTML>({
		title: "YearSelect",
		description: "A select you can use to navigate to a specific year in the calendar view.",
		props: {
			years: createPropSchema({
				type: "number[]",
				description: "The year values to render in the select.",
				default: "The current year and past 100 years",
			}),
			yearFormat: createEnumProp({
				options: ["numeric", "2-digit"],
				description:
					"The format to use for the year strings provided via the `years` slot prop.",
				default: "'numeric'",
				definition: CalendarYearSelectFormatProp,
			}),
			...withChildProps({
				elType: "HTMLSelectElement",
				childDef: CalendarYearSelectChildSnippetProps,
				childrenDef: CalendarYearSelectChildrenSnippetProps,
			}),
		},
		dataAttributes: [
			createDataAttrSchema({
				name: "disabled",
				description: "Present on the year select element when the calendar is disabled.",
			}),
			createDataAttrSchema({
				name: isRange ? "range-calendar-year-select" : "calendar-year-select",
				description: "Present on the year select element.",
			}),
		],
	});
}

export const yearSelect = createCalendarYearSelectSchema(false);

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
	monthSelect,
	yearSelect,
];
