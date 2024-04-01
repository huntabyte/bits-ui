/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateSliderProps, Slider } from "@melt-ui/svelte";
import type { StoresValues } from "svelte/store";
import type { DOMElement, Expand, OmitValue, OnChangeFn } from "$lib/internal/index.js";

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

type ThumbProps = DOMElement<HTMLSpanElement> & {
	/**
	 * An individual thumb builder from the `thumbs` slot prop
	 * provided by the `Slider.Root` component.
	 */
	thumb: Thumb;
};

type TickProps = DOMElement<HTMLSpanElement> & {
	/**
	 * An individual tick builder from the `ticks` slot prop
	 * provided by the `Slider.Root` component.
	 */
	tick: Tick;
};

export type { Props, RangeProps, ThumbProps, TickProps };

type Tick = StoresValues<Slider["elements"]["ticks"]>[number];
type Thumb = StoresValues<Slider["elements"]["thumbs"]>[number];
