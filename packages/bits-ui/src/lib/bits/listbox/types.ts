import type { Expand } from "svelte-toolbelt";
import type { PortalProps } from "../utilities/portal/types.js";
import type { PopperLayerProps, PopperLayerStaticProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";

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
		PrimitiveDivAttributes,
		ListboxSingleRootPropsWithoutHTML | ListboxBaseRootPropsWithoutHTML
	>;

export type ListboxMultipleRootProps = ListboxBaseRootPropsWithoutHTML &
	ListboxMultipleRootPropsWithoutHTML &
	Without<
		PrimitiveDivAttributes,
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

export type ListboxContentPropsWithoutHTML = Expand<
	WithChild<
		Omit<PopperLayerProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedListboxContentProps
	>
>;

export type ListboxContentProps = ListboxContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxContentPropsWithoutHTML>;

export type ListboxContentStaticPropsWithoutHTML = Expand<
	WithChild<
		Omit<PopperLayerStaticProps, "content" | "onOpenAutoFocus" | "trapFocus"> &
			_SharedListboxContentProps
	>
>;

export type ListboxContentStaticProps = ListboxContentStaticPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxContentStaticPropsWithoutHTML>;

export type ListboxTriggerPropsWithoutHTML = WithChild;

export type ListboxTriggerProps = ListboxTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, ListboxTriggerPropsWithoutHTML>;

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
		 * @defaultValeu `false`
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
	Without<PrimitiveDivAttributes, ListboxItemPropsWithoutHTML>;

export type ListboxGroupPropsWithoutHTML = WithChild;

export type ListboxGroupProps = ListboxGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxGroupPropsWithoutHTML>;

export type ListboxGroupHeadingPropsWithoutHTML = WithChild;

export type ListboxGroupHeadingProps = ListboxGroupHeadingPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxGroupHeadingPropsWithoutHTML>;

export type ListboxSeparatorPropsWithoutHTML = WithChild;

export type ListboxSeparatorProps = ListboxSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxSeparatorPropsWithoutHTML>;

export type ListboxPortalPropsWithoutHTML = PortalProps;

export type ListboxPortalProps = ListboxPortalPropsWithoutHTML;

export type ListboxArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type ListboxArrowProps = ArrowProps;

export type ListboxViewportPropsWithoutHTML = WithChild;

export type ListboxViewportProps = ListboxViewportPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxViewportPropsWithoutHTML>;

export type ListboxScrollUpButtonPropsWithoutHTML = WithChild;

export type ListboxScrollUpButtonProps = ListboxScrollUpButtonPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxScrollUpButtonPropsWithoutHTML>;

export type ListboxScrollDownButtonPropsWithoutHTML = WithChild;

export type ListboxScrollDownButtonProps = ListboxScrollDownButtonPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ListboxScrollDownButtonPropsWithoutHTML>;
