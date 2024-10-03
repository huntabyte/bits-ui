import type { HTMLInputAttributes } from "svelte/elements";
import type { Slider as MeltSlider, CreateSliderProps as MeltSliderProps } from "@melt-ui/svelte";
import type { StoresValues } from "svelte/store";
import type {
	DOMEl,
	DOMElement,
	Expand,
	HTMLSpanAttributes,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type SliderPropsWithoutHTML = Expand<
	OmitValue<MeltSliderProps> & {
		/**
		 * The value of the slider.
		 * You can bind this to a number value to programmatically control the value.
		 */
		value?: number[] | undefined;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<number[]> | undefined;
	} & DOMElement<HTMLSpanElement>
>;

export type SliderRangePropsWithoutHTML = DOMElement<HTMLSpanElement>;

export type SliderThumbPropsWithoutHTML = DOMElement<HTMLSpanElement> & {
	/**
	 * An individual thumb builder from the `thumbs` slot prop
	 * provided by the `Slider.Root` component.
	 */
	thumb: Thumb;
};

export type SliderTickPropsWithoutHTML = DOMElement<HTMLSpanElement> & {
	/**
	 * An individual tick builder from the `ticks` slot prop
	 * provided by the `Slider.Root` component.
	 */
	tick: Tick;
};

type Tick = StoresValues<MeltSlider["elements"]["ticks"]>[number];
type Thumb = StoresValues<MeltSlider["elements"]["thumbs"]>[number];

//

export type SliderProps = SliderPropsWithoutHTML & HTMLSpanAttributes;

export type SliderRangeProps = SliderRangePropsWithoutHTML & HTMLSpanAttributes;

export type SliderThumbProps = SliderThumbPropsWithoutHTML & HTMLSpanAttributes;

export type SliderTickProps = SliderTickPropsWithoutHTML & HTMLSpanAttributes;

export type SliderInputProps = Omit<HTMLInputAttributes, "value"> & DOMEl<HTMLInputElement>;

export type SliderThumbEvents<T extends Element = HTMLSpanElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
