/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OnChangeFn, OmitDates, DOMElement } from "$lib/internal/index.js";
import type { DateRange, SegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";
import type { CreateDateFieldProps } from "@melt-ui/svelte";

type Props = Expand<
	Omit<OmitDates<CreateDateFieldProps>, "required" | "name"> & {
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

type InputProps = DOMElement;

type LabelProps = DOMElement<HTMLSpanElement>;

type SegmentProps = Expand<
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

export type { Props, LabelProps, InputProps, SegmentProps };
