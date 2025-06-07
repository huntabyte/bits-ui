import type { RangeCalendarRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createNumberProp,
	valueDateRangeChangeFn,
	valueDateRangeProp,
	withChildProps,
	createBooleanProp,
} from "./helpers.js";
import {
	root as calendarRoot,
	createCalendarCellSchema,
	createCalendarDaySchema,
	createCalendarGridBodySchema,
	createCalendarGridHeadSchema,
	createCalendarGridRowSchema,
	createCalendarGridSchema,
	createCalendarHeadCellSchema,
	createCalendarHeaderSchema,
	createCalendarHeadingSchema,
	createCalendarMonthSelectSchema,
	createCalendarNextButtonSchema,
	createCalendarPrevButtonSchema,
	createCalendarYearSelectSchema,
} from "./calendar.api.js";
import { root as rangeFieldRoot } from "./date-range-field.api.js";
import {
	CalendarRootChildrenSnippetProps,
	CalendarRootChildSnippetProps,
} from "./extended-types/shared/index.js";

export const root = createApiSchema<RangeCalendarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root range calendar component which contains all other calendar components.",
	props: {
		value: valueDateRangeProp,
		onValueChange: valueDateRangeChangeFn,
		placeholder: calendarRoot.props!.placeholder,
		onPlaceholderChange: calendarRoot.props!.onPlaceholderChange,
		pagedNavigation: calendarRoot.props!.pagedNavigation,
		preventDeselect: calendarRoot.props!.preventDeselect,
		weekdayFormat: calendarRoot.props!.weekdayFormat,
		weekStartsOn: calendarRoot.props!.weekStartsOn,
		calendarLabel: calendarRoot.props!.calendarLabel,
		fixedWeeks: calendarRoot.props!.fixedWeeks,
		isDateDisabled: calendarRoot.props!.isDateDisabled,
		isDateUnavailable: calendarRoot.props!.isDateUnavailable,
		maxValue: calendarRoot.props!.maxValue,
		minValue: calendarRoot.props!.minValue,
		locale: calendarRoot.props!.locale,
		numberOfMonths: calendarRoot.props!.numberOfMonths,
		disabled: calendarRoot.props!.disabled,
		readonly: calendarRoot.props!.readonly,
		disableDaysOutsideMonth: calendarRoot.props!.disableDaysOutsideMonth,
		onStartValueChange: rangeFieldRoot.props!.onStartValueChange,
		onEndValueChange: rangeFieldRoot.props!.onEndValueChange,
		minDays: createNumberProp({
			description: "The minimum number of days that can be selected in a range.",
		}),
		maxDays: createNumberProp({
			description: "The maximum number of days that can be selected in a range.",
		}),
		excludeDisabled: createBooleanProp({
			description:
				"Whether to automatically reset the range if any date within the selected range becomes disabled.",
			default: "false",
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
			name: "range-calendar-root",
			description: "Present on the root element.",
		}),
	],
});

const dayCellAttrs = [
	...(createCalendarCellSchema(true).dataAttributes ?? []),
	createDataAttrSchema({
		name: "selection-start",
		description: "Present when the cell is the start of a selection range.",
	}),
	createDataAttrSchema({
		name: "selection-end",
		description: "Present when the cell is the end of a selection range.",
	}),
	createDataAttrSchema({
		name: "selection-middle",
		description:
			"Present when the cell is in the middle of a selection range, but not the start or end of the selection.",
	}),
	createDataAttrSchema({
		name: "highlighted",
		description: "Present when the cell is highlighted within a selection range.",
	}),
];

export const cell: ReturnType<typeof createCalendarCellSchema> = {
	...createCalendarCellSchema(true),
	dataAttributes: dayCellAttrs,
};

export const day: ReturnType<typeof createCalendarDaySchema> = {
	...createCalendarDaySchema(true),
	dataAttributes: dayCellAttrs,
};

export const grid = createCalendarGridSchema(true);
export const gridBody = createCalendarGridBodySchema(true);
export const gridHead = createCalendarGridHeadSchema(true);
export const gridRow = createCalendarGridRowSchema(true);
export const headCell = createCalendarHeadCellSchema(true);
export const header = createCalendarHeaderSchema(true);
export const heading = createCalendarHeadingSchema(true);
export const nextButton = createCalendarNextButtonSchema(true);
export const prevButton = createCalendarPrevButtonSchema(true);
export const monthSelect = createCalendarMonthSelectSchema(true);
export const yearSelect = createCalendarYearSelectSchema(true);

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
	monthSelect,
	yearSelect,
];
