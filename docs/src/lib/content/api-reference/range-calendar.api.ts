import type { RangeCalendarRootPropsWithoutHTML } from "bits-ui";
import { valueDateRangeChangeFn, valueDateRangeProp } from "./shared.js";
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
	defineBooleanProp,
	defineComponentApiSchema,
	defineNumberProp,
	defineSimpleDataAttr,
} from "../utils.js";

export const root = defineComponentApiSchema<RangeCalendarRootPropsWithoutHTML>({
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
		minDays: defineNumberProp({
			description: "The minimum number of days that can be selected in a range.",
		}),
		maxDays: defineNumberProp({
			description: "The maximum number of days that can be selected in a range.",
		}),
		excludeDisabled: defineBooleanProp({
			description:
				"Whether to automatically reset the range if any date within the selected range becomes disabled.",
			default: false,
		}),
		monthFormat: calendarRoot.props!.monthFormat,
		yearFormat: calendarRoot.props!.yearFormat,
		child: calendarRoot.props!.child,
		children: calendarRoot.props!.children,
		ref: calendarRoot.props!.ref,
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
			name: "range-calendar-root",
			description: "Present on the root element.",
		}),
	],
});

const sharedDayCellAttrs = [
	defineSimpleDataAttr({
		name: "range-start",
		description: "Present when the cell is the start of a selection range.",
	}),
	defineSimpleDataAttr({
		name: "range-end",
		description: "Present when the cell is the end of a selection range.",
	}),
	defineSimpleDataAttr({
		name: "range-middle",
		description:
			"Present when the cell is in the middle of a selection range, but not the start or end of the selection.",
	}),
	defineSimpleDataAttr({
		name: "highlighted",
		description: "Present when the cell is highlighted within a selection range.",
	}),
];

const cellSchema = createCalendarCellSchema(true);

export const cell: ReturnType<typeof createCalendarCellSchema> = {
	...cellSchema,
	dataAttributes: [...(cellSchema.dataAttributes ?? []), ...sharedDayCellAttrs],
};

const daySchema = createCalendarDaySchema(true);

export const day: ReturnType<typeof createCalendarDaySchema> = {
	...daySchema,
	dataAttributes: [...(daySchema.dataAttributes ?? []), ...sharedDayCellAttrs],
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
