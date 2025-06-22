import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveSpanAttributes } from "$lib/shared/attributes.js";
import type { Direction, Orientation, SliderThumbPositioning } from "$lib/shared/index.js";

export type TickItem = {
	/**
	 * The value this tick represents
	 */
	value: number;

	/**
	 * The index of this tick in the array of ticks provided by the `children`
	 * or `child` snippet prop of the `Slider.Root` component.
	 */
	index: number;
};

export type ThumbItem = {
	/**
	 * The value this thumb represents
	 */
	value: number;

	/**
	 * The index of this thumb in the array of thumbs provided by the `children`
	 * or `child` snippet prop of the `Slider.Root` component.
	 */
	index: number;
};

export type SliderLabelPosition = "top" | "bottom" | "left" | "right";

export type SliderRootSnippetProps = {
	/**
	 * Use `tickItems` instead. Will be removed in Bits UI v3.
	 *
	 * The indices of the ticks.
	 *
	 * @deprecated Use `tickItems` instead.
	 */
	ticks: number[];

	/**
	 * Use `thumbItems` instead. Will be removed in Bits UI v3.
	 *
	 * The indices of the thumbs.
	 *
	 * @deprecated Use `thumbItems` instead
	 */
	thumbs: number[];

	/**
	 * An array of objects containing the value and index of each tick, useful for
	 * rendering ticks along with labels for each tick.
	 */
	tickItems: TickItem[];

	/**
	 * An array of objects containing the value and index of each thumb, useful for
	 * rendering thumbs along with labels for each thumb.
	 */
	thumbItems: ThumbItem[];
};

export type BaseSliderRootPropsWithoutHTML = {
	/**
	 * Whether to automatically sort the values in the array when moving thumbs past
	 * one another.
	 *
	 * @default true
	 */
	autoSort?: boolean;

	/**
	 * The minimum value of the slider.
	 *
	 * @default 0 (for number step) or the min value of the step array (for array step)
	 */
	min?: number;

	/**
	 * The maximum value of the slider.
	 *
	 * @default 100 (for number step) or the max value of the step array (for array step)
	 */
	max?: number;

	/**
	 * The amount to increment the value by when the user presses the arrow keys,
	 * or an array of specific values that the slider can snap to.
	 *
	 * When an array is provided, the slider will only allow values that exist in the array,
	 * creating discrete tick points. The array values should be within the min/max range
	 * and will be automatically sorted.
	 *
	 * @default 1
	 */
	step?: number | number[];

	/**
	 * The direction of the slider.
	 *
	 * For vertical sliders, setting `dir` to `'rtl'` will caus the slider to start
	 * from the top and move downwards. For horizontal sliders, setting `dir` to `'rtl'`
	 * will cause the slider to start from the left and move rightwards.
	 *
	 * @default 'ltr'
	 */
	dir?: Direction;

	/**
	 * The orientation of the slider.
	 *
	 * @default "horizontal"
	 */
	orientation?: Orientation;

	/**
	 * Whether the slider is disabled or not.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * The positioning of the slider thumb.
	 *
	 * @default "contain"
	 */
	thumbPositioning?: SliderThumbPositioning;

	/**
	 * Padding percentage for the track. Creates space before the first
	 * and after the last tick positions.
	 *
	 * This can also be used as an SSR-friendly alternative to `thumbPositioning="contain"`,
	 * which requires client-side measurement.
	 */
	trackPadding?: number;
};

export type SliderSingleRootPropsWithoutHTML = BaseSliderRootPropsWithoutHTML & {
	/**
	 * The type of slider. If set to `'multiple'`, the slider will
	 * allow multiple ticks and the `value` will be an array of numbers.
	 *
	 * @required
	 */
	type: "single";

	/**
	 * The value of the slider.
	 * @bindable
	 *
	 * @default min
	 */
	value?: number;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<number>;

	/**
	 * A callback function called when the user stops dragging the
	 * thumb and the value is committed.
	 */
	onValueCommit?: OnChangeFn<number>;
};

export type SliderMultiRootPropsWithoutHTML = BaseSliderRootPropsWithoutHTML & {
	/**
	 * The type of slider. If set to `'multiple'`, the slider will
	 * allow multiple ticks and the `value` will be an array of numbers.
	 *
	 * @required
	 */
	type: "multiple";

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
	 * A callback function called when the user stops dragging the
	 * thumb and the value is committed.
	 */
	onValueCommit?: OnChangeFn<number[]>;
};

export type SliderRootPropsWithoutHTML =
	| WithChild<SliderSingleRootPropsWithoutHTML, SliderRootSnippetProps>
	| WithChild<SliderMultiRootPropsWithoutHTML, SliderRootSnippetProps>;

export type SliderSingleRootProps = SliderSingleRootPropsWithoutHTML &
	Without<
		BitsPrimitiveSpanAttributes,
		WithChild<SliderSingleRootPropsWithoutHTML, SliderRootSnippetProps>
	>;

export type SliderMultipleRootProps = SliderMultiRootPropsWithoutHTML &
	Without<
		BitsPrimitiveSpanAttributes,
		WithChild<SliderMultiRootPropsWithoutHTML, SliderRootSnippetProps>
	>;

export type SliderRootProps = SliderRootPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderRootPropsWithoutHTML>;

export type SliderRangePropsWithoutHTML = WithChild;

export type SliderRangeProps = SliderRangePropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderRangePropsWithoutHTML>;

export type SliderThumbSnippetProps = { active: boolean };

export type SliderThumbPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the thumb is disabled or not.
		 *
		 * @default false
		 */
		disabled?: boolean;

		/**
		 * The index of the thumb in the array of thumbs provided by the `children` snippet prop of the
		 * `Slider.Root` component.
		 */
		index: number;
	},
	SliderThumbSnippetProps
>;

export type SliderThumbProps = SliderThumbPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderThumbPropsWithoutHTML>;

export type SliderTickPropsWithoutHTML = WithChild<{
	/**
	 * The index of the tick in the array of ticks provided by the `children` snippet prop of the
	 * `Slider.Root` component.
	 */
	index: number;
}>;

export type SliderTickProps = SliderTickPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderTickPropsWithoutHTML>;

export type SliderTickLabelPropsWithoutHTML = WithChild<{
	/**
	 * The index of the tick the label represents in the array of ticks
	 * provided by the  `children` snippet prop of the `Slider.Root` component.
	 */
	index: number;

	/**
	 * The position of the label relative to the tick.
	 * For horizontal sliders: "top" | "bottom"
	 * For vertical sliders: "left" | "right"
	 *
	 * @default for horizontal sliders = "top" and for vertical sliders = "left"
	 */
	position?: SliderLabelPosition;
}>;

export type SliderTickLabelProps = SliderTickLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderTickLabelPropsWithoutHTML>;

export type SliderThumbLabelPropsWithoutHTML = WithChild<{
	/**
	 * The index of the thumb the label represents in the array of thumbs
	 * provided by the `children` snippet prop of the `Slider.Root` component.
	 */
	index: number;

	/**
	 * The position of the label relative to the thumb.
	 * For horizontal sliders: "top" | "bottom"
	 * For vertical sliders: "left" | "right"
	 *
	 * @default for horizontal sliders = "top" and for vertical sliders = "left"
	 */
	position?: SliderLabelPosition;
}>;

export type SliderThumbLabelProps = SliderThumbLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, SliderThumbLabelPropsWithoutHTML>;
