import type { DateValue } from "@internationalized/date";
import type { CreateDatePickerProps as MeltDatePickerProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OmitDates,
	OmitFloating,
	OnChangeFn,
} from "$lib/internal/index.js";

import type { SegmentPart } from "$lib/shared/index.js";
export type {
	ArrowProps as DatePickerArrowProps,
	CloseEvents as DatePickerCloseEvents,
	CloseProps as DatePickerCloseProps,
	ContentProps as DatePickerContentProps,
	TriggerEvents as DatePickerTriggerEvents,
	TriggerProps as DatePickerTriggerProps,
} from "../popover/index.js";

export type {
	Events as DatePickerCalendarEvents,
	CellProps as DatePickerCellProps,
	DayEvents as DatePickerDayEvents,
	DayProps as DatePickerDayProps,
	GridBodyProps as DatePickerGridBodyProps,
	GridHeadProps as DatePickerGridHeadProps,
	GridProps as DatePickerGridProps,
	GridRowProps as DatePickerGridRowProps,
	HeadCellProps as DatePickerHeadCellProps,
	HeaderProps as DatePickerHeaderProps,
	HeadingProps as DatePickerHeadingProps,
	NextButtonEvents as DatePickerNextButtonEvents,
	NextButtonProps as DatePickerNextButtonProps,
	PrevButtonEvents as DatePickerPrevButtonEvents,
	PrevButtonProps as DatePickerPrevButtonProps,
} from "../calendar/index.js";

export type { SegmentEvents as DatePickerSegmentEvents } from "../date-field/index.js";

export type DatePickerPropsWithoutHTML = Expand<
	Omit<
		OmitFloating<OmitDates<MeltDatePickerProps>>,
		"required" | "name" | "calendarIds" | "dateFieldIds" | "popoverIds"
	> & {
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
		value?: DateValue | undefined;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<DateValue | undefined> | undefined;

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
	}
>;

export type DatePickerInputPropsWithoutHTML = DOMElement;

export type DatePickerDescriptionPropsWithoutHTML = DOMElement;

export type DatePickerLabelPropsWithoutHTML = DOMElement<HTMLSpanElement>;

export type DatePickerCalendarPropsWithoutHTML = DOMElement;

export type DatePickerSegmentPropsWithoutHTML = Expand<
	{
		part: SegmentPart;
	} & DOMElement
>;
//

export type DatePickerProps = DatePickerPropsWithoutHTML;
export type DatePickerLabelProps = DatePickerLabelPropsWithoutHTML & HTMLSpanAttributes;
export type DatePickerSegmentProps = DatePickerSegmentPropsWithoutHTML & HTMLDivAttributes;
export type DatePickerInputProps = DatePickerInputPropsWithoutHTML & HTMLDivAttributes;
export type DatePickerDescriptionProps = DatePickerDescriptionPropsWithoutHTML & HTMLDivAttributes;
export type DatePickerCalendarProps = DatePickerCalendarPropsWithoutHTML & HTMLDivAttributes;
