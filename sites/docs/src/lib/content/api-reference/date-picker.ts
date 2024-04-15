import type {
	DatePickerCalendarPropsWithoutHTML,
	DatePickerInputPropsWithoutHTML,
	DatePickerPropsWithoutHTML,
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
import { dateValueProp, focusProp } from "./extended-types/index.js";
import { builderAndAttrsSlotProps, portalProp } from "./helpers.js";
import { content, trigger } from "./popover.js";
import type { APISchema } from "$lib/types/index.js";
import * as C from "$lib/content/constants.js";
import {
	domElProps,
	enums,
	monthsSlotProp,
	onOutsideClickProp,
	union,
	weekdaysSlotProp,
} from "$lib/content/api-reference/helpers.js";

const root: APISchema<DatePickerPropsWithoutHTML> = {
	title: "Root",
	description: "The root date picker component.",
	props: {
		value: {
			type: dateValueProp,
			description: "The selected date.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue | undefined) => void",
			},
			description: "A function that is called when the selected date changes.",
		},
		placeholder: {
			type: dateValueProp,
			description:
				"The placeholder date, which is used to determine what month to display when no date is selected. This updates as the user navigates the calendar, and can be used to programatically control the calendar's view.",
		},
		onPlaceholderChange: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => void",
			},
			description: "A function that is called when the placeholder date changes.",
		},
		pagedNavigation: {
			type: C.BOOLEAN,
			description:
				"Whether or not to use paged navigation for the calendar. Paged navigation causes the previous and next buttons to navigate by the number of months displayed at once, rather than by one month.",
			default: C.FALSE,
		},
		preventDeselect: {
			type: C.BOOLEAN,
			description:
				"Whether or not to prevent the user from deselecting a date without selecting another date first.",
			default: C.FALSE,
		},
		weekStartsOn: {
			type: C.NUMBER,
			description:
				"The day of the week to start the calendar on. 0 is Sunday, 1 is Monday, etc.",
			default: "0",
		},
		weekdayFormat: {
			type: {
				type: C.ENUM,
				definition: enums("narrow", "short", "long"),
			},
			description:
				"The format to use for the weekday strings provided via the `weekdays` slot prop.",
			default: "'narrow'",
		},
		calendarLabel: {
			type: C.STRING,
			description: "The accessible label for the calendar.",
		},
		fixedWeeks: {
			type: C.BOOLEAN,
			description: "Whether or not to always display 6 weeks in the calendar.",
			default: C.FALSE,
		},
		isDateDisabled: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean",
			},
			description: "A function that returns whether or not a date is disabled.",
		},
		isDateUnavailable: {
			type: {
				type: C.FUNCTION,
				definition: "(date: DateValue) => boolean",
			},
			description: "A function that returns whether or not a date is unavailable.",
		},
		maxValue: {
			type: dateValueProp,
			description: "The maximum date that can be selected.",
		},
		minValue: {
			type: dateValueProp,
			description: "The minimum date that can be selected.",
		},
		locale: {
			type: C.STRING,
			description: "The locale to use for formatting dates.",
		},
		multiple: {
			type: C.BOOLEAN,
			description: "Whether or not multiple dates can be selected.",
			default: C.FALSE,
		},
		numberOfMonths: {
			type: C.NUMBER,
			description: "The number of months to display at once.",
			default: "1",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled.",
		},
		readonly: {
			type: C.BOOLEAN,
			description: "Whether or not the calendar is readonly.",
			default: C.FALSE,
		},
		hourCycle: {
			type: {
				type: C.ENUM,
				definition: union("12", "24"),
			},
			description:
				"The hour cycle to use for formatting times. Defaults to the locale preference",
		},
		granularity: {
			type: {
				type: C.ENUM,
				definition: enums("day", "hour", "minute", "second"),
			},
			description:
				"The granularity to use for formatting the field. Defaults to `'day'` if a `CalendarDate` is provided, otherwise defaults to `'minute'`. The field will render segments for each part of the date up to and including the specified granularity.",
		},
		hideTimeZone: {
			type: C.BOOLEAN,
			description: "Whether or not to hide the time zone segment of the field.",
			default: C.FALSE,
		},
		validationId: {
			type: C.STRING,
			description:
				"The id of your validation message element, if any, which will be applied to the `aria-describedby` attribute of the appropriate elements when a validation error occurs.",
		},
		descriptionId: {
			type: C.STRING,
			description:
				"The id of your description element, if any, which will be applied to the `aria-describedby` attribute of the appropriate elements.",
		},
		disableFocusTrap: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description:
				"Whether or not to disable the focus trap that is applied to the popover when it's open.",
		},
		preventScroll: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not to prevent scrolling the body while the popover is open.",
		},
		closeOnOutsideClick: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the popover when clicking outside of it.",
		},
		closeOnEscape: {
			type: C.BOOLEAN,
			default: C.TRUE,
			description: "Whether or not to close the popover when pressing the escape key.",
		},
		open: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "The open state of the link popover component.",
		},
		onOpenChange: {
			type: {
				type: C.FUNCTION,
				definition: "(open: boolean) => void",
			},
			description: "A callback that fires when the open state changes.",
		},
		openFocus: {
			type: focusProp,
			description: "Override the focus when the popover is opened.",
		},
		closeFocus: {
			type: focusProp,
			description: "Override the focus when the popover is closed.",
		},
		portal: { ...portalProp("popover") },
		onOutsideClick: onOutsideClickProp,
	},
	slotProps: {
		months: monthsSlotProp,
		weekdays: weekdaysSlotProp,
		...builderAndAttrsSlotProps,
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
};

const calendar: APISchema<DatePickerCalendarPropsWithoutHTML> = {
	title: "Calendar",
	description: "The calendar component containing the grids of dates.",
	slotProps: {
		months: monthsSlotProp,
		weekdays: weekdaysSlotProp,
		...builderAndAttrsSlotProps,
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
};

const input: APISchema<DatePickerInputPropsWithoutHTML> = {
	title: "Input",
	description: "The field input component which contains the segments of the date field.",
	props: domElProps("HTMLDivElement"),
	slotProps: {
		...builderAndAttrsSlotProps,
		segments: {
			type: {
				type: C.ARRAY,
				definition: "{ part: SegmentPart; value: string; }[]",
			},
			description: "An array of objects used to render the segments of the date field.",
		},
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
};

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
