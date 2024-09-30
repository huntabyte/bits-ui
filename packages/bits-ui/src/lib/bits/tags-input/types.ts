import type { OnChangeFn } from "$lib/internal/types.js";
import type {
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	PrimitiveInputAttributes,
	WithChild,
	Without,
} from "$lib/shared/index.js";

export type TagsInputBlurBehavior = "clear" | "add" | "none";

export type TagsInputRootPropsWithoutHTML = WithChild<{
	/**
	 * The value of the tags input.
	 *
	 * @bindable
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;

	/**
	 * Whether or not the value is controlled or not. If `true`, the component will not update
	 * the value internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;

	/**
	 * The delimiter used to separate tags.
	 *
	 * @defaultValue ","
	 */
	delimiter?: string;

	/**
	 * How to handle when the input is blurred with text in it.
	 *
	 * @defaultValue "none"
	 */
	blurBehavior?: TagsInputBlurBehavior;
}>;

export type TagsInputRootProps = TagsInputRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TagsInputRootPropsWithoutHTML>;

export type TagsInputListPropsWithoutHTML = WithChild;

export type TagsInputListProps = TagsInputListPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TagsInputListPropsWithoutHTML>;

export type TagsInputInputPropsWithoutHTML = WithChild;

export type TagsInputInputProps = TagsInputInputPropsWithoutHTML &
	Without<PrimitiveInputAttributes, TagsInputInputPropsWithoutHTML>;

export type TagsInputClearPropsWithoutHTML = WithChild;

export type TagsInputClearProps = TagsInputClearPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, TagsInputClearPropsWithoutHTML>;

export type TagsInputTagPropsWithoutHTML = WithChild & {
	/**
	 * The value of this specific tag. This should be unique for the tag.
	 */
	value: string;

	/**
	 * The index of this specific tag in the value array.
	 */
	index: number;
};

export type TagsInputTagProps = TagsInputTagPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TagsInputTagPropsWithoutHTML>;

export type TagsInputTagContentPropsWithoutHTML = WithChild;

export type TagsInputTagContentProps = TagsInputTagContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TagsInputTagContentPropsWithoutHTML>;

export type TagsInputTagRemovePropsWithoutHTML = WithChild;

export type TagsInputTagRemoveProps = TagsInputTagRemovePropsWithoutHTML &
	Without<PrimitiveButtonAttributes, TagsInputTagRemovePropsWithoutHTML>;
