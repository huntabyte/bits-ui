import type { Expand } from "svelte-toolbelt";
import type { PortalProps } from "../utilities/portal/types.js";
import type { PopperLayerProps, PopperLayerStaticProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";

export type ListboxBaseRootPropsWithoutHTML = WithChildren<{
	/**
	 * Whether the combobox is disabled.
	 *
	 * @defaultValue `false`
	 */
	disabled?: boolean;

	/**
	 * Whether the combobox is required (for form submission).
	 *
	 * @defaultValue `false`
	 */
	required?: boolean;

	/**
	 * The name to apply to the hidden input element for form submission.
	 * If not provided, a hidden input will not be rendered and the combobox will not be part of a form.
	 */
	name?: string;

	/**
	 * Whether the combobox popover is open.
	 *
	 * @defaultValue `false`
	 * @bindable
	 */
	open?: boolean;

	/**
	 * A callback function called when the open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * Whether or not the combobox menu should loop through the items when navigating with the keyboard.
	 *
	 * @defaultValue `false`
	 */
	loop?: boolean;

	/**
	 * How to scroll the combobox items into view when navigating with the keyboard.
	 *
	 * @defaultValue `"nearest"`
	 */
	scrollAlignment?: "nearest" | "center";

	/**
	 * Whether or not the open state is controlled or not. If `true`, the component will not update
	 * the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `open` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;

	/**
	 * Whether or not the value state is controlled or not. If `true`, the component will not update
	 * the value state internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;

	/**
	 * Optionally provide an array of `value` and `label` pairs that will be used to match
	 * and trigger selection when the trigger is focused and a key is pressed while the content
	 * is closed.
	 *
	 * By providing this value, you enable selecting a value when the trigger is focused and a key
	 * is pressed without the content being open, similar to how a native `<select>` works.
	 * For this to work, you must
	 *
	 * The label is what the user will potentially search for via typeahead, and the value is what
	 * is set as the selected value when a typeahead match is found.
	 *
	 * We can't rely on the individual `Item` components to do this because they may not ever be
	 * mounted to do the DOM if using a conditional block with a Svelte transition or certain
	 * animation libraries.
	 *
	 * IMPORTANT: This functionality is only available for single-select listboxes.
	 */
	items?: { value: string; label: string }[];
}>;

export type ListboxSingleRootPropsWithoutHTML = {
	/**
	 * The value of the selected combobox item.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The type of combobox.
	 *
	 * @required
	 */
	type: "single";
};

export type ListboxMultipleRootPropsWithoutHTML = {
	/**
	 * The value of the selected combobox item.
	 *
	 * @bindable
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;

	/**
	 * The type of combobox.
	 *
	 * @required
	 */
	type: "multiple";
};

export type ListboxSingleRootProps = ListboxBaseRootPropsWithoutHTML &
	ListboxSingleRootPropsWithoutHTML &
	Without<
		BitsPrimitiveDivAttributes,
		ListboxSingleRootPropsWithoutHTML | ListboxBaseRootPropsWithoutHTML
	>;

export type ListboxMultipleRootProps = ListboxBaseRootPropsWithoutHTML &
	ListboxMultipleRootPropsWithoutHTML &
	Without<
		BitsPrimitiveDivAttributes,
		ListboxMultipleRootPropsWithoutHTML | ListboxBaseRootPropsWithoutHTML
	>;

export type ListboxRootPropsWithoutHTML = ListboxBaseRootPropsWithoutHTML &
	(ListboxSingleRootPropsWithoutHTML | ListboxMultipleRootPropsWithoutHTML);

export type ListboxRootProps = ListboxRootPropsWithoutHTML;

export type _SharedListboxContentProps = {
	/**
	 * Whether or not to loop through the items when navigating with the keyboard.
	 *
	 * @defaultValue `false`
	 */
	loop?: boolean;
};

export type ListboxContentSnippetProps = {
	/**
	 * Whether the content is open or closed. Used alongside the `forceMount` prop to conditionally
	 * render the content using Svelte transitions.
	 */
	open: boolean;
};

export type ListboxContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedListboxContentProps,
		ListboxContentSnippetProps
	>
>;

export type ListboxContentProps = ListboxContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxContentPropsWithoutHTML>;

export type ListboxContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedListboxContentProps,
		ListboxContentSnippetProps
	>
>;

export type ListboxContentStaticProps = ListboxContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxContentStaticPropsWithoutHTML>;

export type ListboxContentAlignedPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedListboxContentProps,
		ListboxContentSnippetProps
	>
>;
export type ListboxContentAlignedProps = ListboxContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxContentStaticPropsWithoutHTML>;

export type ListboxTriggerPropsWithoutHTML = WithChild;

export type ListboxTriggerProps = ListboxTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, ListboxTriggerPropsWithoutHTML>;

export type ListboxItemSnippetProps = { selected: boolean; highlighted: boolean };

export type ListboxItemPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the item.
		 *
		 * @required
		 */
		value: string;

		/**
		 * The label of the item. If provided, this is the item that users will search for.
		 * If not provided, the value will be used as the label.
		 */
		label?: string;

		/**
		 * Whether the item is disabled.
		 *
		 * @defaultValue `false`
		 */
		disabled?: boolean;

		/**
		 * A callback function called when the item is highlighted. This can be used as a
		 * replacement for `onfocus` since we don't actually focus the item and instead
		 * rely on the `aria-activedescendant` attribute to indicate the highlighted item.
		 */
		onHighlight?: () => void;

		/**
		 * A callback function called when the item is unhighlighted. This can be used as a
		 * replacement for `onblur` since we don't actually focus the item and instead
		 * rely on the `aria-activedescendant` attribute to indicate the highlighted item.
		 */
		onUnhighlight?: () => void;
	},
	ListboxItemSnippetProps
>;

export type ListboxItemProps = ListboxItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxItemPropsWithoutHTML>;

export type ListboxGroupPropsWithoutHTML = WithChild;

export type ListboxGroupProps = ListboxGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxGroupPropsWithoutHTML>;

export type ListboxGroupHeadingPropsWithoutHTML = WithChild;

export type ListboxGroupHeadingProps = ListboxGroupHeadingPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxGroupHeadingPropsWithoutHTML>;

export type ListboxSeparatorPropsWithoutHTML = WithChild;

export type ListboxSeparatorProps = ListboxSeparatorPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxSeparatorPropsWithoutHTML>;

export type ListboxPortalPropsWithoutHTML = PortalProps;

export type ListboxPortalProps = ListboxPortalPropsWithoutHTML;

export type ListboxArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type ListboxArrowProps = ArrowProps;

export type ListboxViewportPropsWithoutHTML = WithChild;

export type ListboxViewportProps = ListboxViewportPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxViewportPropsWithoutHTML>;

export type ListboxScrollUpButtonPropsWithoutHTML = WithChild;

export type ListboxScrollUpButtonProps = ListboxScrollUpButtonPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxScrollUpButtonPropsWithoutHTML>;

export type ListboxScrollDownButtonPropsWithoutHTML = WithChild;

export type ListboxScrollDownButtonProps = ListboxScrollDownButtonPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ListboxScrollDownButtonPropsWithoutHTML>;
