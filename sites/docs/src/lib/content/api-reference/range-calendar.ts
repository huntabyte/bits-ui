import type {
	RangeCalendarCellPropsWithoutHTML,
	RangeCalendarDayPropsWithoutHTML,
	RangeCalendarRootPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createDataAttrSchema,
	createFunctionProp,
	withChildProps,
} from "./helpers.js";
import {
	cell as calendarCell,
	day as calendarDay,
	root as calendarRoot,
	grid,
	gridBody,
	gridHead,
	gridRow,
	headCell,
	header,
	heading,
	nextButton,
	prevButton,
} from "./calendar.js";
import { root as rangeFieldRoot } from "./date-range-field.js";

export const root = createApiSchema<RangeCalendarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root range calendar component which contains all other calendar components.",
	props: {
		value: {
			type: {
				type: "DateRange",
				definition: "{ start: DateValue | undefined; end: DateValue | undefined; }",
			},
			description: "The selected date range.",
			bindable: true,
		},
		onValueChange: createFunctionProp({
			definition: "(date: DateRange | undefined) => void",
			description: "A function that is called when the selected date range changes.",
		}),
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

const dayCellAttrs = [
	...(calendarCell.dataAttributes ?? []),
	createDataAttrSchema({
		name: "selection-start",
		description: "Present when the cell is the start of a selection.",
	}),
	createDataAttrSchema({
		name: "selection-end",
		description: "Present when the cell is the end of a selection.",
	}),
	createDataAttrSchema({
		name: "highlighted",
		description: "Present when the cell is highlighted within a range.",
	}),
];

export const cell = createApiSchema<RangeCalendarCellPropsWithoutHTML>({
	...calendarCell,
	dataAttributes: dayCellAttrs,
});

export const day = createApiSchema<RangeCalendarDayPropsWithoutHTML>({
	...calendarDay,
	dataAttributes: dayCellAttrs,
});
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
