import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { Orientation } from "$lib/index.js";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type RatingGroupItemState = "active" | "partial" | "inactive";

export type RatingGroupItemData = {
	index: number;
	state: RatingGroupItemState;
};

export type RatingGroupRootSnippetProps = {
	items: RatingGroupItemData[];
	value: number;
	max: number;
};

export type RatingGroupAriaValuetext =
	| BitsPrimitiveDivAttributes["aria-valuetext"]
	| ((value: number, max: number) => string);

export type RatingGroupRootPropsWithoutHTML = WithChild<
	{
		/**
		 * The orientation of the rating group. Used to determine
		 * how keyboard interactions work.
		 *
		 * @default "horizontal"
		 */
		orientation?: Orientation;

		/**
		 * The current rating value.
		 *
		 * @default 0
		 */
		value?: number;

		/**
		 * The callback to call when the rating value changes.
		 */
		onValueChange?: OnChangeFn<number>;

		/**
		 * The name to apply to the rating group's input element for
		 * form submission. If not provided, a hidden input will not
		 * be rendered and the rating group will not be part of a form.
		 *
		 * @default undefined
		 */
		name?: string;

		/**
		 * Whether the rating group is disabled.
		 *
		 * @default false
		 */
		disabled?: boolean;

		/**
		 * Whether the rating group is required for form submission.
		 * If `true`, ensure you provide a `name` prop so the hidden
		 * input is rendered.
		 *
		 * @default false
		 */
		required?: boolean;

		/**
		 * The minimum rating value.
		 *
		 * @default 0
		 */
		min?: number;

		/**
		 * The maximum rating value (number of items).
		 *
		 * @default 5
		 */
		max?: number;

		/**
		 * Whether to allow half-star ratings.
		 *
		 * @default false
		 */
		allowHalf?: boolean;

		/**
		 * Whether the rating group is readonly.
		 *
		 * @default false
		 */
		readonly?: boolean;

		/**
		 * Whether to show a preview when hovering over rating items.
		 * Touch events are ignored to prevent accidental previews.
		 *
		 * @default true
		 */
		hoverPreview?: boolean;

		/**
		 * An extended `aria-valuetext` property to use for the rating group.
		 * Can either be a string, or a function that receives the current value
		 * and max value and returns a string.
		 *
		 * @default ((value: number, max: number) => `${value} out of ${max}`)
		 */
		"aria-valuetext"?: RatingGroupAriaValuetext;
	},
	RatingGroupRootSnippetProps
>;

export type RatingGroupRootProps = RatingGroupRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, RatingGroupRootPropsWithoutHTML>;

export type RatingGroupItemSnippetProps = {
	state: RatingGroupItemState;
};

export type RatingGroupItemPropsWithoutHTML = WithChild<
	{
		/**
		 * The index of the rating item (0-based index).
		 */
		index: number;

		/**
		 * Whether the rating item is disabled.
		 *
		 * @default false
		 */
		disabled?: boolean | null | undefined;
	},
	RatingGroupItemSnippetProps
>;

export type RatingGroupItemProps = RatingGroupItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, RatingGroupItemPropsWithoutHTML>;
