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
	CalendarMonthFormatProp,
	CalendarMonthSelectChildrenSnippetProps,
	CalendarMonthSelectChildSnippetProps,
	CalendarMonthSelectFormatProp,
	CalendarOnValueChangeProp,
	CalendarRootChildrenSnippetProps,
	CalendarRootChildSnippetProps,
	CalendarValueProp,
	CalendarYearFormatProp,
	CalendarYearSelectChildrenSnippetProps,
	CalendarYearSelectChildSnippetProps,
	CalendarYearSelectFormatProp,
	DateMatcherProp,
	WeekdayFormatProp,
} from "./extended-types/shared/index.js";
import {
	dateValueProp,
	onPlaceholderChangeProp,
	typeSingleOrMultipleProp,
	withChildProps,
} from "./shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineSimplePropSchema,
	defineUnionProp,
} from "../utils.js";

const sharedCellDayAttrs = [
	defineSimpleDataAttr({
		name: "disabled",
		description: "Present when the day is disabled.",
	}),
	defineSimpleDataAttr({
		name: "unavailable",
		description: "Present when the day is unavailable.",
	}),
	defineSimpleDataAttr({
		name: "today",
		description: "Present when the day is today.",
	}),
	defineSimpleDataAttr({
		name: "outside-month",
		description: "Present when the day is outside the current month.",
	}),
	defineSimpleDataAttr({
		name: "outside-visible-months",
		description: "Present when the day is outside the visible months.",
	}),
	defineSimpleDataAttr({
		name: "focused",
		description: "Present when the day is focused.",
	}),
	defineSimpleDataAttr({
		name: "selected",
		description: "Present when the day is selected.",
	}),
	defineSimpleDataAttr({
		name: "value",
		description: 'The date in the format "YYYY-MM-DD".',
	}),
];

export const root = defineComponentApiSchema<CalendarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root calendar component which contains all other calendar components.",
	props: {
		type: typeSingleOrMultipleProp,
		value: defineUnionProp({
			options: ["DateValue", "DateValue[]"],
			description:
				"The selected date(s). If `type` is `'single'`, this will be a `DateValue`. If `type` is `'multiple'`, this will be an array of `DateValue`s.",
			bindable: true,
			definition: CalendarValueProp,
		}),
		onValueChange: defineFunctionProp({
			definition: CalendarOnValueChangeProp,
			description: "A function that is called when the selected date changes.",
			stringDefinition: "(value: DateValue) => void | (value: DateValue[]) => void",
		}),
		placeholder: {
			...dateValueProp,
			description:
				"The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programmatically control the calendar's view.",
		},
		onPlaceholderChange: onPlaceholderChangeProp,
		pagedNavigation: defineBooleanProp({
			description:
				"Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.",
			default: false,
		}),
		preventDeselect: defineBooleanProp({
			description:
				"Whether or not to prevent the user from deselecting a date without selecting another date first.",
			default: false,
		}),
		weekStartsOn: defineNumberProp({
			description:
				"An absolute day of the week to start the calendar on, regardless of locale. `0` is Sunday, `1` is Monday, etc. If not provided, the calendar will default to the locale's first day of the week.",
		}),
		weekdayFormat: defineEnumProp({
			options: ["narrow", "short", "long"],
			definition: WeekdayFormatProp,
			description:
				"The format to use for the weekday strings provided via the `weekdays` slot prop.",
			default: "'narrow'",
		}),
		calendarLabel: defineStringProp({
			description: "The accessible label for the calendar.",
		}),
		fixedWeeks: defineBooleanProp({
			description: "Whether or not to always display 6 weeks in the calendar.",
			default: false,
		}),
		isDateDisabled: defineFunctionProp({
			definition: DateMatcherProp,
			description: "A function that returns whether or not a date is disabled.",
			stringDefinition: "(date: DateValue) => boolean",
		}),
		isDateUnavailable: defineFunctionProp({
			definition: DateMatcherProp,
			description: "A function that returns whether or not a date is unavailable.",
			stringDefinition: "(date: DateValue) => boolean",
		}),
		maxValue: {
			...dateValueProp,
			description: "The maximum date that can be selected.",
		},
		minValue: {
			...dateValueProp,
			description: "The minimum date that can be selected.",
		},
		locale: defineStringProp({
			description: "The locale to use for formatting dates.",
			default: "'en'",
		}),
		numberOfMonths: defineNumberProp({
			description: "The number of months to display at once.",
			default: 1,
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the accordion is disabled.",
		}),
		readonly: defineBooleanProp({
			description: "Whether or not the calendar is readonly.",
			default: false,
		}),
		initialFocus: defineBooleanProp({
			description:
				"If `true`, the calendar will focus the selected day, today, or the first day of the month in that order depending on what is visible when the calendar is mounted.",
			default: false,
		}),
		disableDaysOutsideMonth: defineBooleanProp({
			description: "Whether or not to disable days outside the current month.",
			default: false,
		}),
		maxDays: defineNumberProp({
			description:
				"The maximum number of days that can be selected when the calendar is `'multiple'` type.",
		}),
		monthFormat: defineUnionProp({
			options: ["short", "long", "narrow", "numeric", "2-digit", "(month: number) => string"],
			definition: CalendarMonthFormatProp,
			description:
				"The format to use for the month strings provided via the `months` slot prop.",
			default: "'long'",
		}),
		yearFormat: defineUnionProp({
			options: ["numeric", "2-digit", "(year: number) => string"],
			definition: CalendarYearFormatProp,
			description:
				"The format to use for the year strings provided via the `years` slot prop.",
			default: "'numeric'",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: CalendarRootChildSnippetProps,
				stringDefinition: `type Month<T> = {
	/**
	 * A DateValue used to represent the month. Since days
	 * from the previous and next months may be included in the
	 * calendar grid, we need a source of truth for the value
	 * the grid is representing.
	 */
	value: DateValue;

	/**
	 * An array of arrays representing the weeks in the calendar.
	 * Each sub-array represents a week, and contains the dates for each
	 * day in that week. This structure is useful for rendering the calendar
	 * grid using a table, where each row represents a week and each cell
	 * represents a day.
	 */
	weeks: T[][];

	/**
	 * An array of all the dates in the current month, including dates from
	 * the previous and next months that are used to fill out the calendar grid.
	 * This array is useful for rendering the calendar grid in a customizable way,
	 * as it provides all the dates that should be displayed in the grid in a flat
	 * array.
	 */
	dates: T[];
};

type ChildSnippetProps = {
	props: Record<string, unknown>;
	months: Month<DateValue>[];
	weekdays: string[];
};`,
			},
			children: {
				definition: CalendarRootChildrenSnippetProps,
				stringDefinition: `type Month<T> = {
	/**
	 * A DateValue used to represent the month. Since days
	 * from the previous and next months may be included in the
	 * calendar grid, we need a source of truth for the value
	 * the grid is representing.
	 */
	value: DateValue;

	/**
	 * An array of arrays representing the weeks in the calendar.
	 * Each sub-array represents a week, and contains the dates for each
	 * day in that week. This structure is useful for rendering the calendar
	 * grid using a table, where each row represents a week and each cell
	 * represents a day.
	 */
	weeks: T[][];

	/**
	 * An array of all the dates in the current month, including dates from
	 * the previous and next months that are used to fill out the calendar grid.
	 * This array is useful for rendering the calendar grid in a customizable way,
	 * as it provides all the dates that should be displayed in the grid in a flat
	 * array.
	 */
	dates: T[];
};

type ChildrenSnippetProps = {
	months: Month<DateValue>[];
	weekdays: string[];
};`,
			},
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "invalid",
			description: "Present on the root element when the calendar is invalid.",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present on the root element when the calendar is disabled.",
		}),
		defineSimpleDataAttr({
			name: "readonly",
			description: "Present on the root element when the calendar is readonly.",
		}),
		defineSimpleDataAttr({
			name: "calendar-root",
			description: "Present on the root element.",
		}),
	],
});

export function createCalendarCellSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarCellPropsWithoutHTML>({
		title: "Cell",
		description: "A cell in the calendar grid.",
		props: {
			date: {
				...dateValueProp,
				description: "The date for the cell.",
			},
			month: {
				...dateValueProp,
				description: "The current month the date is being displayed in.",
			},
			...withChildProps({ elType: "HTMLTableCellElement" }),
		},
		dataAttributes: [
			...sharedCellDayAttrs,
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-cell" : "calendar-cell",
				description: "Present on the cell element.",
			}),
		],
	});
}

export const cell = createCalendarCellSchema(false);

export function createCalendarDaySchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarDayPropsWithoutHTML>({
		title: "Day",
		description: "A day in the calendar grid.",
		props: withChildProps({ elType: "HTMLDivElement" }),
		dataAttributes: [
			...sharedCellDayAttrs,
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-day" : "calendar-day",
				description: "Present on the day element.",
			}),
		],
	});
}

export const day = createCalendarDaySchema(false);

export function createCalendarGridSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarGridPropsWithoutHTML>({
		title: "Grid",
		description: "The grid of dates in the calendar, typically representing a month.",
		props: withChildProps({ elType: "HTMLTableElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the grid element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the grid element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-grid" : "calendar-grid",
				description: "Present on the grid element.",
			}),
		],
	});
}

export const grid = createCalendarGridSchema(false);

export function createCalendarGridBodySchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarGridBodyPropsWithoutHTML>({
		title: "GridBody",
		description: "The body of the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableSectionElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the grid element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the grid element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-grid-body" : "calendar-grid-body",
				description: "Present on the grid body element.",
			}),
		],
	});
}

export const gridBody = createCalendarGridBodySchema(false);

export function createCalendarGridHeadSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarGridHeadPropsWithoutHTML>({
		title: "GridHead",
		description: "The head of the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableSectionElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the grid head element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the grid head element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-grid-head" : "calendar-grid-head",
				description: "Present on the grid head element.",
			}),
		],
	});
}

export const gridHead = createCalendarGridHeadSchema(false);

export function createCalendarGridRowSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarGridRowPropsWithoutHTML>({
		title: "GridRow",
		description: "A row in the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableRowElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the grid row element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the grid row element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-grid-row" : "calendar-grid-row",
				description: "Present on the grid row element.",
			}),
		],
	});
}

export const gridRow = createCalendarGridRowSchema(false);

export function createCalendarHeadCellSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarHeadCellPropsWithoutHTML>({
		title: "HeadCell",
		description: "A cell in the head of the grid of dates in the calendar.",
		props: withChildProps({ elType: "HTMLTableCellElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the head cell element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the head cell element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-head-cell" : "calendar-head-cell",
				description: "Present on the head cell element.",
			}),
		],
	});
}

export const headCell = createCalendarHeadCellSchema(false);

export function createCalendarHeaderSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarHeaderPropsWithoutHTML>({
		title: "Header",
		description: "The header of the calendar.",
		props: withChildProps({ elType: "HTMLElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the header element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the header element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-header" : "calendar-header",
				description: "Present on the header element.",
			}),
		],
	});
}

export const header = createCalendarHeaderSchema(false);

export function createCalendarHeadingSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarHeadingPropsWithoutHTML>({
		title: "Heading",
		description: "The heading of the calendar.",
		props: withChildProps({ elType: "HTMLDivElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the heading element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: "readonly",
				description: "Present on the heading element when the calendar is readonly.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-heading" : "calendar-heading",
				description: "Present on the heading element.",
			}),
		],
	});
}

export const heading = createCalendarHeadingSchema(false);

export function createCalendarNextButtonSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarNextButtonPropsWithoutHTML>({
		title: "NextButton",
		description: "The next button of the calendar.",
		props: withChildProps({ elType: "HTMLButtonElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description:
					"Present on the next button element when the calendar or this button is disabled.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-next-button" : "calendar-next-button",
				description: "Present on the next button element.",
			}),
		],
	});
}

export const nextButton = createCalendarNextButtonSchema(false);

export function createCalendarPrevButtonSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarPrevButtonPropsWithoutHTML>({
		title: "PrevButton",
		description: "The previous button of the calendar.",
		props: withChildProps({ elType: "HTMLButtonElement" }),
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description:
					"Present on the prev button element when the calendar or this button is disabled.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-prev-button" : "calendar-prev-button",
				description: "Present on the prev button element.",
			}),
		],
	});
}

export const prevButton = createCalendarPrevButtonSchema(false);

export function createCalendarMonthSelectSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarMonthSelectPropsWithoutHTML>({
		title: "MonthSelect",
		description: "A select you can use to navigate to a specific month in the calendar view.",
		props: {
			months: defineSimplePropSchema({
				type: "number[]",
				description: "The month values to render in the select.",
				default: "[1-12]",
			}),
			monthFormat: defineEnumProp({
				options: [
					"narrow",
					"short",
					"long",
					"numeric",
					"2-digit",
					"(month: number) => string",
				],
				description:
					"The format to use for the month strings provided via the `months` slot prop. If a function is provided, it will be called with the month number as an argument and should return a string.",
				default: "'narrow'",
				definition: CalendarMonthSelectFormatProp,
			}),
			...withChildProps({
				elType: "HTMLSelectElement",
				child: {
					definition: CalendarMonthSelectChildSnippetProps,
					stringDefinition: `type ChildSnippetProps = {
	props: Record<string, unknown>;
	monthItems: Array<{ value: number; label: string }>;
	selectedMonthItem: { value: number; label: string };
};`,
				},
				children: {
					definition: CalendarMonthSelectChildrenSnippetProps,
					stringDefinition: `type ChildrenSnippetProps = {
	monthItems: Array<{ value: number; label: string }>;
	selectedMonthItem: { value: number; label: string };
};`,
				},
			}),
		},
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the month select element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
				name: isRange ? "range-calendar-month-select" : "calendar-month-select",
				description: "Present on the month select element.",
			}),
		],
	});
}

export const monthSelect = createCalendarMonthSelectSchema(false);

export function createCalendarYearSelectSchema(isRange: boolean) {
	return defineComponentApiSchema<CalendarYearSelectPropsWithoutHTML>({
		title: "YearSelect",
		description: "A select you can use to navigate to a specific year in the calendar view.",
		props: {
			years: defineSimplePropSchema({
				type: "number[]",
				description: "The year values to render in the select.",
				default:
					"The current year or placeholder year (whichever is higher) + 10 and minus 100 years. When a `minValue`/`maxValue` is provided to `Calendar.Root`, those will be used to constrain the range.",
			}),
			yearFormat: defineEnumProp({
				options: ["numeric", "2-digit", "(year: number) => string"],
				description:
					"The format to use for the year strings provided via the `years` slot prop. If a function is provided, it will be called with the year as an argument and should return a string.",
				default: "'numeric'",
				definition: CalendarYearSelectFormatProp,
			}),
			...withChildProps({
				elType: "HTMLSelectElement",
				child: {
					definition: CalendarYearSelectChildSnippetProps,
					stringDefinition: `type ChildSnippetProps = {
	props: Record<string, unknown>;
	yearItems: Array<{ value: number; label: string }>;
	selectedYearItem: { value: number; label: string };
};`,
				},
				children: {
					definition: CalendarYearSelectChildrenSnippetProps,
					stringDefinition: `type ChildrenSnippetProps = {
	yearItems: Array<{ value: number; label: string }>;
	selectedYearItem: { value: number; label: string };
};`,
				},
			}),
		},
		dataAttributes: [
			defineSimpleDataAttr({
				name: "disabled",
				description: "Present on the year select element when the calendar is disabled.",
			}),
			defineSimpleDataAttr({
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
