/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateSliderProps } from "@melt-ui/svelte";
import type { Expand, OmitValue, OnChangeFn, DOMElement } from "$lib/internal/index.js";

type Props = Expand<
	OmitValue<CreateSliderProps> & {
		/**
		 * The value of the slider.
		 * You can bind this to a number value to programmatically control the value.
		 */
		value?: number[];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<number[]>;
	} & DOMElement<HTMLSpanElement>
>;

type RangeProps = DOMElement<HTMLSpanElement>;

type ThumbProps = DOMElement<HTMLSpanElement>;

type TickProps = DOMElement<HTMLSpanElement>;

export type { Props, RangeProps, ThumbProps, TickProps };
