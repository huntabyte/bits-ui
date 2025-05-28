import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { Orientation } from "$lib/index.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";

export type RatingGroupItem = {
	value: number;
	active: boolean;
	partial: boolean;
	state: "active" | "partial" | "inactive";
};

export type RatingGroupRootSnippetProps = {
	items: RatingGroupItem[];
	value: number;
	max: number;
};

export type RatingGroupRootPropsWithoutHTML = WithChild<
	{
		/**
		 * The orientation of the rating group. Used to determine
		 * how keyboard navigation should work.
		 *
		 * @default "horizontal"
		 */
		orientation?: Orientation;

		/**
		 * Whether to loop around the rating items when navigating
		 * with the keyboard.
		 *
		 * @default false
		 */
		loop?: boolean;

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
	},
	RatingGroupRootSnippetProps
>;

export type RatingGroupRootProps = RatingGroupRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, RatingGroupRootPropsWithoutHTML>;

export type RatingGroupItemSnippetProps = {
	active: boolean;
	partial: boolean;
	value: number;
	rootValue: number;
};

export type RatingGroupItemPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the rating item (1-based index).
		 */
		value: number;

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
	Without<BitsPrimitiveButtonAttributes, RatingGroupItemPropsWithoutHTML>;
