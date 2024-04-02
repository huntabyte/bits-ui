import type { DateValue } from "@internationalized/date";
import type { CreateDateRangeFieldProps as MeltDateRangeFieldProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OmitDates,
	OnChangeFn,
} from "$lib/internal/index.js";

import type { DateRange, SegmentPart } from "$lib/shared/index.js";

export type { DateFieldSegmentEvents as DateRangeFieldSegmentEvents } from "../date-field/types.js";

type CreateDateRangeFieldProps = Omit<
	OmitDates<MeltDateRangeFieldProps>,
	"required" | "name" | "startIds" | "endIds" | "startName" | "endName"
>;

export type DateRangeFieldPropsWithoutHTML = Expand<
	Omit<
		OmitDates<CreateDateRangeFieldProps>,
		"required" | "name" | "startIds" | "endIds" | "startName" | "endName"
	> & {
		/**
		 * The value of the date field.
		 * You can bind this to a `DateValue` object to programmatically control the value.
		 */
		value?: DateRange;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<DateRange | undefined>;

		/**
		 * The placeholder date used to start the field.
		 */
		placeholder?: DateValue;

		/**
		 * A callback function called when the placeholder changes.
		 */
		onPlaceholderChange?: OnChangeFn<DateValue>;

		/**
		 * The id of the validation message element which is used to apply the
		 * appropriate `aria-describedby` attribute to the input.
		 */
		validationId?: string;

		/**
		 * The id of the description element which is used to describe the input.
		 * This is used to apply the appropriate `aria-describedby` attribute to the input.
		 */
		descriptionId?: string;
	}
>;

export type DateRangeFieldInputPropsWithoutHTML = DOMElement;

export type DateRangeFieldLabelPropsWithoutHTML = DOMElement<HTMLSpanElement>;

export type DateRangeFieldSegmentPropsWithoutHTML = Expand<
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

export type DateRangeFieldProps = DateRangeFieldPropsWithoutHTML;
export type DateRangeFieldLabelProps = DateRangeFieldLabelPropsWithoutHTML & HTMLSpanAttributes;
export type DateRangeFieldSegmentProps = DateRangeFieldSegmentPropsWithoutHTML & HTMLDivAttributes;
export type DateRangeFieldInputProps = DateRangeFieldInputPropsWithoutHTML & HTMLDivAttributes;
