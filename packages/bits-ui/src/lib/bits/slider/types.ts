import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveSpanAttributes } from "$lib/shared/attributes.js";
import type { Direction, Orientation } from "$lib/shared/index.js";

export type SliderRootSnippetProps = {
	ticks: number[];
	thumbs: number[];
};

export type SliderRootPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the slider.
		 * @bindable
		 */
		value?: number[];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<number[]>;

		/**
		 * A callback function called when the user stops dragging the thumb,
		 * which is useful for knowing when the user has finished interacting with the slider.
		 */
		onValueChangeEnd?: OnChangeFn<number[]>;

		/**
		 * Whether to automatically sort the values in the array when moving thumbs past
		 * one another.
		 *
		 * @defaultValue true
		 */
		autoSort?: boolean;
		/**
		 * The minimum value of the slider.
		 *
		 * @defaultValue 0
		 */
		min?: number;

		/**
		 * The maximum value of the slider.
		 *
		 * @defaultValue 100
		 */
		max?: number;

		/**
		 * The amount to increment the value by when the user presses the arrow keys.
		 *
		 * @defayltValue 1
		 */
		step?: number;

		/**
		 * The direction of the slider.
		 *
		 * For vertical sliders, setting `dir` to `'rtl'` will caus the slider to start
		 * from the top and move downwards. For horizontal sliders, setting `dir` to `'rtl'`
		 * will cause the slider to start from the left and move rightwards.
		 *
		 * @defaultValue 'ltr'
		 */
		dir?: Direction;

		/**
		 * The orientation of the slider.
		 *
		 * @defaultValue "horizontal"
		 */
		orientation?: Orientation;

		/**
		 * Whether the slider is disabled or not.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * Whether or not the value state is controlled or not. If `true`, the component will
		 * not update the value state internally, instead it will call `onValueChange` when it
		 * would have otherwise, and it is up to you to update the `value` prop that is passed
		 * to the component.
		 *
		 * @defaultValue false
		 */
		controlledValue?: boolean;
	},
	SliderRootSnippetProps
>;

export type SliderRootProps = SliderRootPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SliderRootPropsWithoutHTML>;

export type SliderRangePropsWithoutHTML = WithChild;

export type SliderRangeProps = SliderRangePropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SliderRangePropsWithoutHTML>;

export type SliderThumbPropsWithoutHTML = WithChild<{
	/**
	 * Whether the thumb is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * The index of the thumb in the array of thumbs provided by the `children` snippet prop of the
	 * `Slider.Root` component.
	 */
	index: number;
}>;

export type SliderThumbProps = SliderThumbPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SliderThumbPropsWithoutHTML>;

export type SliderTickPropsWithoutHTML = WithChild<{
	/**
	 * The index of the tick in the array of ticks provided by the `children` snippet prop of the
	 * `Slider.Root` component.
	 */
	index: number;
}>;

export type SliderTickProps = SliderTickPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, SliderTickPropsWithoutHTML>;
