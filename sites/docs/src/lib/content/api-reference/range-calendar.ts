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
import { createApiSchema, createFunctionProp, withChildProps } from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";
import {
	root as calendarRoot,
	cell,
	day,
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
