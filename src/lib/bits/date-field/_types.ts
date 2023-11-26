/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OnChangeFn, AsChild, OmitDates } from "$lib/internal/index.js";
import type { SegmentPart } from "$lib/shared";
import type { DateValue } from "@internationalized/date";
import type { CreateDateFieldProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitDates<CreateDateFieldProps> & {
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
	} & AsChild
>;

type InputProps = AsChild;

type FieldProps = AsChild;

type LabelProps = AsChild;

type SegmentProps = Expand<
	{
		part: SegmentPart;
	} & AsChild
>;

export type { Props, FieldProps, LabelProps, InputProps, SegmentProps };
