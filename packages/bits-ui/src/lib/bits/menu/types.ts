import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type {
	OnChangeFn,
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
	 * The reading direction of the menu.
	 */
	dir?: Direction;
};

export type MenuContentPropsWithoutHTML = WithAsChild<Omit<PopperLayerProps, "dir">>;

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
}>;

export type MenuItemProps = MenuItemPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenuItemPropsWithoutHTML>;
