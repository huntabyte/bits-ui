import type { DateValue } from "@internationalized/date";
import type { CreateDateRangePickerProps as MeltDateRangePickerProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OmitDates,
	OmitFloating,
	OnChangeFn,
} from "$lib/internal/index.js";

import type { DateRange, SegmentPart } from "$lib/shared/index.js";
export type {
	RangeCalendarCellProps as DateRangePickerCellProps,
	RangeCalendarDayEvents as DateRangePickerDayEvents,
	RangeCalendarDayProps as DateRangePickerDayProps,
	RangeCalendarEvents as DateRangePickerCalendarEvents,
	RangeCalendarGridBodyProps as DateRangePickerGridBodyProps,
	RangeCalendarGridHeadProps as DateRangePickerGridHeadProps,
	RangeCalendarGridProps as DateRangePickerGridProps,
	RangeCalendarGridRowProps as DateRangePickerGridRowProps,
	RangeCalendarHeadCellProps as DateRangePickerHeadCellProps,
	RangeCalendarHeaderProps as DateRangePickerHeaderProps,
	RangeCalendarHeadingProps as DateRangePickerHeadingProps,
	RangeCalendarNextButtonEvents as DateRangePickerNextButtonEvents,
	RangeCalendarNextButtonProps as DateRangePickerNextButtonProps,
	RangeCalendarPrevButtonEvents as DateRangePickerPrevButtonEvents,
	RangeCalendarPrevButtonProps as DateRangePickerPrevButtonProps,
} from "$lib/bits/range-calendar/types.js";

export type {
	PopoverArrowProps as DateRangePickerArrowProps,
	PopoverCloseEvents as DateRangePickerCloseEvents,
	PopoverCloseProps as DateRangePickerCloseProps,
	PopoverContentProps as DateRangePickerContentProps,
	PopoverTriggerEvents as DateRangePickerTriggerEvents,
	PopoverTriggerProps as DateRangePickerTriggerProps,
} from "$lib/bits/popover/types.js";

export type { DateRangeFieldSegmentEvents as DateRangePickerSegmentEvents } from "$lib/bits/date-range-field/types.js";

type OmitStartEnd<T> = Omit<
	T,
	"startName" | "endName" | "startIds" | "endIds" | "dateFieldIds" | "popoverIds" | "calendarIds"
>;

type OmitForm<T> = Omit<T, "required" | "name">;

type WithOmission<T> = OmitForm<OmitDates<OmitStartEnd<OmitFloating<T>>>>;

export type DateRangePickerPropsWithoutHTML = Expand<
	WithOmission<MeltDateRangePickerProps> & {
		/**
		 * The open state of the popover.
		 * You can bind this to a boolean value to programmatically control the open state.
		 *
		 * @default false
		 */
		open?: boolean | undefined;

		/**
		 * A callback function called when the open state changes.
		 */
		onOpenChange?: OnChangeFn<boolean> | undefined;

		/**
		 * The value of the date field.
		 * You can bind this to a `DateValue` object to programmatically control the value.
		 */
		value?: DateRange | undefined;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<DateRange | undefined> | undefined;

		/**
		 * The placeholder date used to start the field.
		 */
		placeholder?: DateValue | undefined;

		/**
		 * A callback function called when the placeholder changes.
		 */
		onPlaceholderChange?: OnChangeFn<DateValue> | undefined;

		/**
		 * The id of the validation message element which is used to apply the
		 * appropriate `aria-describedby` attribute to the input.
		 */
		validationId?: string | undefined;

		/**
		 * The id of the description element which is used to describe the input.
		 * This is used to apply the appropriate `aria-describedby` attribute to the input.
		 */
		descriptionId?: string | undefined;

		/**
		 * The `start` value of the date range, which can exist prior
		 * to the `value` being set. The `value` is only set once a `start`
		 * and `end` value are selected.
		 *
		 * You can `bind:startValue` to a value to receive updates outside
		 * this component when the user selects a `start` value.
		 *
		 * Modifying this value outside the component will have no effect.
		 * To programmatically control the `start` value, use `bind:value`
		 * and update the `start` property of the `DateRange` object.
		 *
		 * This is provided as a convenience for use cases where you want
		 * to display the selected `start` value outside the component before
		 * the `value` is set.
		 */
		startValue?: DateValue | undefined;
	}
>;

export type DateRangePickerInputPropsWithoutHTML = DOMElement;

export type DateRangePickerDescriptionPropsWithoutHTML = DOMElement;

export type DateRangePickerLabelPropsWithoutHTML = DOMElement<HTMLSpanElement>;

export type DateRangePickerCalendarPropsWithoutHTML = DOMElement;

export type DateRangePickerSegmentPropsWithoutHTML = Expand<
	{
		/**
		 * The type of field to render (start or end).
		 */
		type: "start" | "end";

		/**
		 * The part of the date to render.
		 */
		part: SegmentPart;
	} & DOMElement
>;

//

export type DateRangePickerProps = DateRangePickerPropsWithoutHTML;
export type DateRangePickerLabelProps = DateRangePickerLabelPropsWithoutHTML & HTMLSpanAttributes;
export type DateRangePickerSegmentProps = DateRangePickerSegmentPropsWithoutHTML &
	HTMLDivAttributes;
export type DateRangePickerInputProps = DateRangePickerInputPropsWithoutHTML & HTMLDivAttributes;
export type DateRangePickerDescriptionProps = DateRangePickerDescriptionPropsWithoutHTML &
	HTMLDivAttributes;
export type DateRangePickerCalendarProps = DateRangePickerCalendarPropsWithoutHTML &
	HTMLDivAttributes;
