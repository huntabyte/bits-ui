import type { OnChangeFn } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveInputAttributes,
	WithChild,
	Without,
} from "$lib/shared/index.js";

export type TagsInputBlurBehavior = "clear" | "add" | "none";
export type TagsInputPasteBehavior = "add" | "none";

/**
 * Custom announcers to use for the tags input. These will be read out when the various
 * actions are performed to screen readers. For each that isn't provided, the following
 * default announcers will be used. The goal is to eventually support localization on our
 * end for these, but for now we want to allow for custom announcers to be passed in.
 *
 * - `add`: `(value: string) => "${value} added"`
 * - `addMultiple`: `(value: string[]) => "${values.join(", ")} added"`
 * - `edit`: `(fromValue: string, toValue: string) => "${fromValue} changed to ${toValue}"`
 * - `remove`: `(value: string) => "${value} removed"`
 */
export type TagsInputAnnounceTransformers = {
	/**
	 * A function that returns the announcement to make when a tag is edited.
	 * @param fromValue - the value that was changed from
	 * @param toValue - the value that was changed to
	 * @returns - the announcement to make
	 */
	edit?: (fromValue: string, toValue: string) => string;
	/**
	 * A function that returns the announcement to make when a tag is added.
	 * @param value - the value that was added
	 * @returns  the announcement to make
	 */
	add?: (addedValue: string) => string;
	/**
	 * A function that returns the announcement to make when multiple tags are
	 * added at once.
	 * @param value - the value that was added
	 * @returns  the announcement to make
	 */
	addMultiple?: (addedValues: string[]) => string;
	/**
	 * A function that returns the announcement to make when a tag is removed.
	 * @param value - the value that was removed
	 * @returns the announcement to make
	 */
	remove?: (removedValue: string) => string;
};

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
	 * The delimiter used to separate tags.
	 *
	 * @default [","]
	 */
	delimiters?: string[];

	/**
	 * A validation function to determine if the individual tag being added/edited is valid.
	 *
	 * Return true to allow the tag to be added/edited, or false to prevent it from being
	 * added/confirm edited.
	 */
	validate?: (value: string) => boolean;

	/**
	 * If provided, a hidden input element will be rendered for each tag to submit the values with
	 * a form.
	 *
	 * @defaultValue undefined
	 */
	name?: string;

	/**
	 * Whether or not the hidden input element should be marked as required or not.
	 *
	 * @defaultValue false
	 */
	required?: boolean;

	/**
	 * Custom announcers to use for the tags input. These will be read out when the various
	 * actions are performed to screen readers. For each that isn't provided, the following
	 * default announcers will be used. The goal is to eventually support localization on our
	 * end for these, but for now we want to allow for custom announcers to be passed in.
	 *
	 * - `add`: `(value: string) => "${value} added"`
	 * - `addMultiple`: `(value: string[]) => "${values.join(", ")} added"`
	 * - `edit`: `(fromValue: string, toValue: string) => "${fromValue} changed to ${toValue}"`
	 * - `remove`: `(value: string) => "${value} removed"`
	 */
	announceTransformers?: TagsInputAnnounceTransformers;
}>;

export type TagsInputRootProps = TagsInputRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TagsInputRootPropsWithoutHTML>;

export type TagsInputListPropsWithoutHTML = WithChild;

export type TagsInputListProps = TagsInputListPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TagsInputListPropsWithoutHTML>;

export type TagsInputInputPropsWithoutHTML = WithChild<{
	/**
	 * The value of the input.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback function called when the value changes.
	 *
	 *
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * Whether or not the value is controlled or not. If `true`, the component will not update
	 * the value internally, instead it will call `onValueChange` when it would have otherwise,
	 * and it is up to you to update the `value` prop that is passed to the component.
	 */
	controlledValue?: boolean;

	/**
	 * How to handle when the input is blurred with text in it.
	 *
	 * - `'clear'`: Clear the input and remove all tags.
	 * - `'add'`: Add the text as a new tag. If it contains valid delimiters, it will be split into multiple tags.
	 * - `'none'`: Don't do anything special when the input is blurred. Just leave the input as is.
	 *
	 * @defaultValue "none"
	 */
	blurBehavior?: TagsInputBlurBehavior;

	/**
	 * How to handle when text is pasted into the input.
	 * - `'add'`: Add the pasted text as a new tag. If it contains valid delimiters, it will be split into multiple tags.
	 * - `'none'`: Do not add the pasted text as a new tag, just insert it into the input.
	 *
	 * @defaultValue "add"
	 */
	pasteBehavior?: TagsInputPasteBehavior;
}>;

export type TagsInputInputProps = TagsInputInputPropsWithoutHTML &
	Without<BitsPrimitiveInputAttributes, TagsInputInputPropsWithoutHTML>;

export type TagsInputClearPropsWithoutHTML = WithChild;

export type TagsInputClearProps = TagsInputClearPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, TagsInputClearPropsWithoutHTML>;

export type TagsInputTagPropsWithoutHTML = WithChild<{
	/**
	 * The value of this specific tag. This should be unique for the tag.
	 */
	value: string;

	/**
	 * The index of this specific tag in the value array.
	 */
	index: number;

	/**
	 * The type of edit mode to use for the tag. If set to `'input'`, the tag will be editable
	 * using the `TagsInput.TagEdit` component. If set to `'contenteditable'`, the tag will be
	 * editable using the `contenteditable` attribute on the `TagsInput.TagText` component. If
	 * set to `'none'`, the tag will not be editable.
	 *
	 * @defaultValue true
	 */
	editMode?: "input" | "contenteditable" | "none";

	/**
	 * Whether the tag can be removed or not.
	 *
	 * @defaultValue true
	 */
	removable?: boolean;
}>;

export type TagsInputTagProps = TagsInputTagPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TagsInputTagPropsWithoutHTML>;

export type TagsInputTagTextPropsWithoutHTML = WithChild;

export type TagsInputTagTextProps = TagsInputTagTextPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TagsInputTagTextPropsWithoutHTML>;

export type TagsInputTagRemovePropsWithoutHTML = WithChild;

export type TagsInputTagRemoveProps = TagsInputTagRemovePropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, TagsInputTagRemovePropsWithoutHTML>;

export type TagsInputTagEditPropsWithoutHTML = WithChild;

export type TagsInputTagEditProps = TagsInputTagEditPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, TagsInputTagEditPropsWithoutHTML>;

export type TagsInputTagEditInputPropsWithoutHTML = WithChild;

export type TagsInputTagEditInputProps = Omit<
	TagsInputTagEditInputPropsWithoutHTML &
		Without<BitsPrimitiveInputAttributes, TagsInputTagEditInputPropsWithoutHTML>,
	"children"
>;

export type TagsInputTagContentPropsWithoutHTML = WithChild;

export type TagsInputTagContentProps = TagsInputTagContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TagsInputTagContentPropsWithoutHTML>;
