/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OnChangeFn, OmitDates, DOMElement } from "$lib/internal/index.js";
import type { SegmentPart } from "$lib/shared";
import type { DateValue } from "@internationalized/date";
import type { CreateDateFieldProps } from "@melt-ui/svelte";

type Props = Expand<
	Omit<OmitDates<CreateDateFieldProps>, "required" | "name"> & {
		/**
		 * The value of the date field.
		 * You can bind this to a `DateValue` object to programmatically control the value.
		 */
		value?: DateValue;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<DateValue | undefined>;

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

type DescriptionProps = DOMElement;

type LabelProps = DOMElement<HTMLSpanElement>;

type SegmentProps = Expand<
	{
		part: SegmentPart;
	} & DOMElement
>;

export type { Props, LabelProps, DescriptionProps, InputProps, SegmentProps };
