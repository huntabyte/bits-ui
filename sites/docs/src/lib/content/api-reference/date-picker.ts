import type {
	DatePickerCalendarPropsWithoutHTML,
	DatePickerInputPropsWithoutHTML,
	DatePickerRootPropsWithoutHTML,
} from "bits-ui";
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
import { label, segment } from "./date-field.js";
import {
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createFunctionProp,
	withChildProps,
} from "./helpers.js";
import { content, trigger } from "./popover.js";
import * as C from "$lib/content/constants.js";
import { root as calendarRoot } from "./calendar.js";
import { root as dateFieldRoot } from "./date-field.js";

export const root = createApiSchema<DatePickerRootPropsWithoutHTML>({
	title: "Root",
	description: "The root date picker component.",
	props: {
		value: calendarRoot.props!.value,
		onValueChange: calendarRoot.props!.onValueChange,
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the popover content.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: "(open: boolean) => void",
			description: "A callback that fires when the open state changes.",
		}),
		name: dateFieldRoot.props!.name,
		isDateUnavailable: dateFieldRoot.props!.isDateUnavailable,
		isDateDisabled: calendarRoot.props!.isDateDisabled,
		required: dateFieldRoot.props!.required,
		readonlySegments: dateFieldRoot.props!.readonlySegments,
		disableDaysOutsideMonth: calendarRoot.props!.disableDaysOutsideMonth,
		closeOnDateSelect: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the popover when a date is selected.",
		},
		placeholder: calendarRoot.props!.placeholder,
		onPlaceholderChange: calendarRoot.props!.onPlaceholderChange,
		pagedNavigation: calendarRoot.props!.pagedNavigation,
		preventDeselect: calendarRoot.props!.preventDeselect,
		weekStartsOn: calendarRoot.props!.weekStartsOn,
		weekdayFormat: calendarRoot.props!.weekdayFormat,
		calendarLabel: calendarRoot.props!.calendarLabel,
		fixedWeeks: calendarRoot.props!.fixedWeeks,
		maxValue: calendarRoot.props!.maxValue,
		minValue: calendarRoot.props!.minValue,
		locale: calendarRoot.props!.locale,
		numberOfMonths: calendarRoot.props!.numberOfMonths,
		disabled: calendarRoot.props!.disabled,
		readonly: dateFieldRoot.props!.readonly,
		hourCycle: dateFieldRoot.props!.hourCycle,
		granularity: dateFieldRoot.props!.granularity,
		hideTimeZone: dateFieldRoot.props!.hideTimeZone,
		children: childrenSnippet(),
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

const calendar = createApiSchema<DatePickerCalendarPropsWithoutHTML>({
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

const input = createApiSchema<DatePickerInputPropsWithoutHTML>({
	title: "Input",
	description: "The field input component which contains the segments of the date field.",
	props: withChildProps({ elType: "HTMLDivElement" }),
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

export const datePicker = [
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
