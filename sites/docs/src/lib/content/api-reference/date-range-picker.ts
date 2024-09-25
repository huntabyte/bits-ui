import type {
	DateRangePickerCalendarPropsWithoutHTML,
	DateRangePickerInputPropsWithoutHTML,
	DateRangePickerRootPropsWithoutHTML,
} from "bits-ui";
import { label, root as rangeFieldRoot, segment } from "./date-range-field.js";
import { createApiSchema, createBooleanProp, withChildProps } from "./helpers.js";
import { content, trigger } from "./popover.js";
import {
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
import { root as rangeCalendarRoot } from "./range-calendar.js";
import { root as datePickerRoot } from "./date-picker.js";
import * as C from "$lib/content/constants.js";
import { enums } from "$lib/content/api-reference/helpers.js";

const root = createApiSchema<DateRangePickerRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date picker component.",
	props: {
		value: rangeFieldRoot.props!.value,
		onValueChange: rangeFieldRoot.props!.onValueChange,
		controlledValue: rangeFieldRoot.props!.controlledValue,
		placeholder: rangeFieldRoot.props!.placeholder,
		onPlaceholderChange: rangeFieldRoot.props!.onPlaceholderChange,
		controlledPlaceholder: rangeFieldRoot.props!.controlledPlaceholder,
		readonlySegments: rangeFieldRoot.props!.readonlySegments,
		isDateUnavailable: rangeFieldRoot.props!.isDateUnavailable,
		minValue: rangeFieldRoot.props!.minValue,
		maxValue: rangeFieldRoot.props!.maxValue,
		granularity: rangeFieldRoot.props!.granularity,
		hideTimeZone: rangeFieldRoot.props!.hideTimeZone,
		hourCycle: rangeFieldRoot.props!.hourCycle,
		locale: rangeFieldRoot.props!.locale,
		disabled: rangeFieldRoot.props!.disabled,
		readonly: rangeFieldRoot.props!.readonly,
		required: rangeFieldRoot.props!.required,
		closeOnRangeSelect: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not to close the popover when a date range is selected.",
		}),
		disableDaysOutsideMonth: rangeCalendarRoot.props!.disableDaysOutsideMonth,
		pagedNavigation: rangeCalendarRoot.props!.pagedNavigation,
		preventDeselect: rangeCalendarRoot.props!.preventDeselect,
		weekdayFormat: rangeCalendarRoot.props!.weekdayFormat,
		weekStartsOn: rangeCalendarRoot.props!.weekStartsOn,
		calendarLabel: rangeCalendarRoot.props!.calendarLabel,
		fixedWeeks: rangeCalendarRoot.props!.fixedWeeks,
		isDateDisabled: rangeCalendarRoot.props!.isDateDisabled,
		numberOfMonths: rangeCalendarRoot.props!.numberOfMonths,
		open: datePickerRoot.props!.open,
		onOpenChange: datePickerRoot.props!.onOpenChange,
		controlledOpen: datePickerRoot.props!.controlledOpen,
		onEndValueChange: rangeFieldRoot.props!.onEndValueChange,
		onStartValueChange: rangeFieldRoot.props!.onStartValueChange,
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

const calendar = createApiSchema<DateRangePickerCalendarPropsWithoutHTML>({
	title: "Calendar",
	description: "The calendar component containing the grids of dates.",
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

const input = createApiSchema<DateRangePickerInputPropsWithoutHTML>({
	title: "Input",
	description: "The field input component which contains the segments of the date field.",
	props: {
		name: {
			type: C.STRING,
			description:
				"The name of the input field used for form submission. If provided a hidden input will be rendered alongside the field.",
		},
		type: {
			type: {
				type: C.ENUM,
				definition: enums("text", "hidden"),
			},
			description: "The part of the date this input represents.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "invalid",
			description: "Present on the element when the field is invalid.",
		},
		{
			name: "disabled",
			description: "Present on the element when the field is disabled.",
		},
		{
			name: "date-field-input",
			description: "Present on the element.",
		},
	],
});

export const dateRangePicker = [
	root,
	label,
	input,
	segment,
	trigger,
	content,
	calendar,
	header,
	prevButton,
	heading,
	nextButton,
	grid,
	gridRow,
	gridHead,
	headCell,
	gridBody,
	cell,
	day,
];
