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
import type { FloatingContentSnippetProps, StaticContentSnippetProps } from "$lib/shared/types.js";

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
	 * A callback that is called when the menu is opened or closed.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

	/**
	 * The direction of the site.
	 *
	 * @defaultValue "ltr"
	 */
	dir?: Direction;
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

export type MenuContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, "content"> & _SharedMenuContentProps,
		FloatingContentSnippetProps
	>
>;

export type MenuContentProps = MenuContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuContentPropsWithoutHTML>;

export type MenuContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content"> & _SharedMenuContentProps,
		StaticContentSnippetProps
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
		 * Whether or not the menu item should close when selected.
		 *
		 * @defaultValue true
		 */
		closeOnSelect?: boolean;

		/**
		 * The value of the checkbox item when used in a checkbox group.
		 */
		value?: string;
	};

export type MenuCheckboxItemProps = MenuCheckboxItemPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuCheckboxItemPropsWithoutHTML>;

export type MenuCheckboxGroupPropsWithoutHTML = WithChild<{
	/**
	 * The values of the selected checkbox items.
	 *
	 * Supports two-way binding with `bind:value`.
	 */
	value?: string[];

	/**
	 * A callback that is fired when the selected checkbox items change.
	 */
	onValueChange?: OnChangeFn<string[]>;
}>;

export type MenuCheckboxGroupProps = MenuCheckboxGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuCheckboxGroupPropsWithoutHTML>;

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
	 * A callback that is called when the menu finishes opening/closing animations.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;
}>;

export type MenuSubProps = MenuSubPropsWithoutHTML;

export type MenuSubContentPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerProps, "content" | "preventScroll"> & _SharedMenuContentProps,
		FloatingContentSnippetProps
	>
>;

export type MenuSubContentProps = MenuSubContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuSubContentPropsWithoutHTML>;

export type MenuSubContentStaticPropsWithoutHTML = Expand<
	WithChildNoChildrenSnippetProps<
		Omit<PopperLayerStaticProps, "content" | "preventScroll"> & _SharedMenuContentProps,
		StaticContentSnippetProps
	>
>;

export type MenuSubContentStaticProps = MenuSubContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MenuSubContentStaticPropsWithoutHTML>;

export type MenuSubTriggerPropsWithoutHTML = Omit<MenuItemPropsWithoutHTML, "closeOnSelect">;
export type MenuSubTriggerProps = Omit<MenuItemProps, "closeOnSelect">;

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
