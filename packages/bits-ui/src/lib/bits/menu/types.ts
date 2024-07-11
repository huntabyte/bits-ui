import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithChild,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
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
}>;

export type MenuRootProps = MenuRootPropsWithoutHTML;

export type MenuContentPropsWithoutHTML = WithChild<PopperLayerProps>;

export type MenuContentProps = MenuContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuContentPropsWithoutHTML>;

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
		},
		U
	>;

export type MenuItemProps = MenuItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuItemPropsWithoutHTML>;

export type MenuCheckboxItemSnippetProps = { checked: boolean | "indeterminate" };

export type MenuCheckboxItemPropsWithoutHTML =
	MenuItemPropsWithoutHTML<MenuCheckboxItemSnippetProps> & {
		/**
		 * The checked state of the checkbox item.
		 *
		 * Supports two-way binding with `bind:checked`.
		 */
		checked?: boolean | "indeterminate";

		/**
		 * A callback that is fired when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	};

export type MenuCheckboxItemProps = MenuCheckboxItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuCheckboxItemPropsWithoutHTML>;

export type MenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
}>;

export type MenuTriggerProps = MenuTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, MenuTriggerPropsWithoutHTML>;

export type MenuSubPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the menu.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the menu is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;
}>;

export type MenuSubContentPropsWithoutHTML = WithChild<PopperLayerProps>;
export type MenuSubContentProps = MenuSubContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuSubContentPropsWithoutHTML>;

export type MenuSubTriggerPropsWithoutHTML = MenuItemPropsWithoutHTML;
export type MenuSubTriggerProps = MenuItemProps;

export type MenuSeparatorPropsWithoutHTML = WithChild;
export type MenuSeparatorProps = MenuSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuSeparatorPropsWithoutHTML>;

export type MenuArrowPropsWithoutHTML = ArrowPropsWithoutHTML;
export type MenuArrowProps = ArrowProps;

export type MenuGroupPropsWithoutHTML = WithChild;
export type MenuGroupProps = MenuGroupPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuGroupPropsWithoutHTML>;

export type MenuLabelPropsWithoutHTML = WithChild;
export type MenuLabelProps = MenuLabelPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuLabelPropsWithoutHTML>;

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
	Without<PrimitiveDivAttributes, MenuRadioGroupPropsWithoutHTML>;

export type MenuRadioItemSnippetProps = { checked: boolean };

export type MenuRadioItemPropsWithoutHTML = MenuItemPropsWithoutHTML<MenuRadioItemSnippetProps> & {
	/**
	 * The value of the radio item.
	 */
	value: string;
};

export type MenuRadioItemProps = MenuRadioItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuRadioItemPropsWithoutHTML>;

export type MenuPortalPropsWithoutHTML = PortalProps;
export type MenuPortalProps = MenuPortalPropsWithoutHTML;
