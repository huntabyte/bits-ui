import type { DateValue } from "@internationalized/date";
import type { CreateDateFieldProps as MeltDateFieldProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OmitDates,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { SegmentPart } from "$lib/shared/index.js";

export type DateFieldPropsWithoutHTML = Expand<
	Omit<OmitDates<MeltDateFieldProps>, "required" | "name"> & {
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

export type DateFieldInputPropsWithoutHTML = DOMElement;

export type DateFieldDescriptionPropsWithoutHTML = DOMElement;

export type DateFieldLabelPropsWithoutHTML = DOMElement<HTMLSpanElement>;

export type DateFieldSegmentPropsWithoutHTML = Expand<
	{
		part: SegmentPart;
	} & DOMElement
>;

export type DateFieldProps = DateFieldPropsWithoutHTML;

export type DateFieldLabelProps = DateFieldLabelPropsWithoutHTML & HTMLSpanAttributes;

export type DateFieldSegmentProps = DateFieldSegmentPropsWithoutHTML & HTMLDivAttributes;

export type DateFieldInputProps = DateFieldInputPropsWithoutHTML & HTMLDivAttributes;

export type DateFieldDescriptionProps = DateFieldDescriptionPropsWithoutHTML & HTMLDivAttributes;

export type DateFieldSegmentEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
	focusout: CustomEventHandler<FocusEvent, HTMLDivElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};
