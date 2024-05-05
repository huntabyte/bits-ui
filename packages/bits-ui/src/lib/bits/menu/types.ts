import type { Snippet } from "svelte";
import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
	Without,
} from "$lib/internal/types.js";
import type { Direction } from "$lib/shared/index.js";

export type MenuRootPropsWithoutHTML = {
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

	children?: Snippet;
};

export type MenuContentPropsWithoutHTML = WithAsChild<PopperLayerProps>;

export type MenuContentProps = MenuContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuContentPropsWithoutHTML>;

export type MenuItemPropsWithoutHTML = WithAsChild<{
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
	 */
	onSelect?: () => void;
}>;

export type MenuItemProps = MenuItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuItemPropsWithoutHTML>;

export type MenuTriggerPropsWithoutHTML = WithAsChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
}>;

export type MenuTriggerProps = MenuTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, MenuTriggerPropsWithoutHTML>;

export type MenuSubPropsWithoutHTML = {
	/**
	 * The open state of the menu.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the menu is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	children?: Snippet;
};

export type MenuSubContentPropsWithoutHTML = WithAsChild<PopperLayerProps>;

export type MenuSubContentProps = MenuSubContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuSubContentPropsWithoutHTML>;

export type MenuSeparatorPropsWithoutHTML = WithAsChild<{}>;

export type MenuSeparatorProps = MenuSeparatorPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuSeparatorPropsWithoutHTML>;
