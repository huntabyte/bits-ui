import type { Expand } from "svelte-toolbelt";
import type { PopperLayerProps, PopperLayerStaticProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type { Direction } from "$lib/shared/index.js";
import type { PortalProps } from "$lib/bits/utilities/portal/types.js";

export type MenuRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the menu.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the menu is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The direction of the site.
	 *
	 * @defaultValue "ltr"
	 */
	dir?: Direction;

	/**
	 * Whether or not the open state is controlled or not. If `true`, the component will not update
	 * the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `open` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;
}>;

export type MenuRootProps = MenuRootPropsWithoutHTML;

export type _SharedMenuContentProps = {
	/**
	 * When `true`, the menu will loop through items when navigating with the keyboard.
	 *
	 * @defaultValue false
	 */
	loop?: boolean;
};

export type MenuContentSnippetProps = {
	/**
	 * Whether the content is open or closed. Used alongside the `forceMount` prop to
	 * conditionally render the content using Svelte transitions.
	 */
	open: boolean;
};

export type MenuContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, "content"> & _SharedMenuContentProps,
		MenuContentSnippetProps
	>
>;

export type MenuContentProps = MenuContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuContentPropsWithoutHTML>;

export type MenuContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content"> & _SharedMenuContentProps,
		MenuContentSnippetProps
	>
>;

export type MenuContentStaticProps = MenuContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuContentStaticPropsWithoutHTML>;

export type MenuItemPropsWithoutHTML<U extends Record<PropertyKey, unknown> = { _default: never }> =
	WithChild<
		{
			/**
			 * When `true`, the user will not be able to interact with the menu item.
			 *
			 * @defaultValue false
			 */
			disabled?: boolean;

			/**
			 * Optional text to use for typeahead filtering. By default, typeahead will use
			 * the `.textContent` of the menu item. When the content is more complex, you
			 * can provide a string here instead.
			 *
			 * @defaultValue undefined
			 */
			textValue?: string;

			/**
			 * A callback fired when the menu item is selected.
			 *
			 * Prevent default behavior of selection with `event.preventDefault()`.
			 */
			onSelect?: (event: Event) => void;

			/**
			 * Whether or not the menu item should close when selected.
			 * @defaultValue true
			 */
			closeOnSelect?: boolean;
		},
		U
	>;

export type MenuItemProps = MenuItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuItemPropsWithoutHTML>;

export type MenuCheckboxItemSnippetProps = { checked: boolean; indeterminate: boolean };

export type MenuCheckboxItemPropsWithoutHTML =
	MenuItemPropsWithoutHTML<MenuCheckboxItemSnippetProps> & {
		/**
		 * The checked state of the checkbox. It can be one of:
		 * - `true` for checked
		 * - `false` for unchecked
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback that is fired when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;

		/**
		 * Whether or not the checked state is controlled or not. If `true`, the component will not
		 * update the checked state internally, instead it will call `onCheckedChange` when it
		 * would have otherwise, and it is up to you to update the `checked` prop that is passed
		 * to the component.
		 *
		 * @defaultValue false
		 */
		controlledChecked?: boolean;

		/**
		 * Whether the checkbox is in an indeterminate state or not.
		 *
		 * @defaultValue false
		 */
		indeterminate?: boolean;

		/**
		 * A callback function called when the indeterminate state changes.
		 */
		onIndeterminateChange?: OnChangeFn<boolean>;

		/**
		 * Whether the indeterminate state is controlled or not. If `true`, the checkbox will
		 * not update the indeterminate state internally, instead it will call
		 * `onIndeterminateChange` when it would have otherwise, and it is up to you to update
		 * the `indeterminate` prop that is passed to the component.
		 *
		 * @defaultValue false
		 */
		controlledIndeterminate?: boolean;

		/**
		 * Whether or not the menu item should close when selected.
		 *
		 * @defaultValue true
		 */
		closeOnSelect?: boolean;
	};

export type MenuCheckboxItemProps = MenuCheckboxItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuCheckboxItemPropsWithoutHTML>;

export type MenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type MenuTriggerProps = MenuTriggerPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, MenuTriggerPropsWithoutHTML>;

export type MenuSubPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the menu.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the menu is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * Whether or not the open state is controlled or not. If `true`, the component will not update
	 * the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `open` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;
}>;

export type MenuSubProps = MenuSubPropsWithoutHTML;

export type MenuSubContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, "content" | "preventScroll"> & _SharedMenuContentProps,
		MenuContentSnippetProps
	>
>;

export type MenuSubContentProps = MenuSubContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuSubContentPropsWithoutHTML>;

export type MenuSubContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content" | "preventScroll"> & _SharedMenuContentProps,
		MenuContentSnippetProps
	>
>;

export type MenuSubContentStaticProps = MenuSubContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuSubContentStaticPropsWithoutHTML>;

export type MenuSubTriggerPropsWithoutHTML = MenuItemPropsWithoutHTML;
export type MenuSubTriggerProps = MenuItemProps;

export type MenuSeparatorPropsWithoutHTML = WithChild;
export type MenuSeparatorProps = MenuSeparatorPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuSeparatorPropsWithoutHTML>;

export type MenuArrowPropsWithoutHTML = ArrowPropsWithoutHTML;
export type MenuArrowProps = ArrowProps;

export type MenuGroupPropsWithoutHTML = WithChild;
export type MenuGroupProps = MenuGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuGroupPropsWithoutHTML>;

export type MenuGroupHeadingPropsWithoutHTML = WithChild;
export type MenuGroupHeadingProps = MenuGroupHeadingPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuGroupHeadingPropsWithoutHTML>;

export type MenuRadioGroupPropsWithoutHTML = WithChild<{
	/**
	 * The value of the selected radio item.
	 *
	 * Supports two-way binding with `bind:value`.
	 */
	value?: string;

	/**
	 * A callback that is fired when the selected radio item changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * Whether or not the value state is controlled or not. If `true`, the component will not update
	 * the value state internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;
}>;

export type MenuRadioGroupProps = MenuRadioGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuRadioGroupPropsWithoutHTML>;

export type MenuRadioItemSnippetProps = { checked: boolean };

export type MenuRadioItemPropsWithoutHTML = MenuItemPropsWithoutHTML<MenuRadioItemSnippetProps> & {
	/**
	 * The value of the radio item.
	 */
	value: string;

	/**
	 * Whether or not the menu item should close when selected.
	 * @defaultValue true
	 */
	closeOnSelect?: boolean;
};

export type MenuRadioItemProps = MenuRadioItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuRadioItemPropsWithoutHTML>;

export type MenuPortalPropsWithoutHTML = PortalProps;
export type MenuPortalProps = MenuPortalPropsWithoutHTML;
