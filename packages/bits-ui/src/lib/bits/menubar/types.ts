import type { Snippet } from "svelte";
import type { MenuContentProps, MenuContentPropsWithoutHTML } from "../menu/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
	Without,
} from "$lib/internal/types.js";
import type { Direction } from "$lib/shared/index.js";

export type MenubarRootPropsWithoutHTML = WithAsChild<{
	/**
	 * The reading direction of the menubar.
	 */
	dir?: Direction;

	/**
	 * When `true`, the roving focus will loop back to the first menu item when the last
	 * menu item is reached and vice verse.
	 */
	loop?: boolean;

	/**
	 * The 'value' assigned to the currently active menu in the menubar.
	 */
	value?: string;

	/**
	 * A callback that is called when the active menu changes.
	 */
	onValueChange?: OnChangeFn<string>;
}>;

export type MenubarRootProps = MenubarRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenubarRootPropsWithoutHTML>;

export type MenubarMenuPropsWithoutHTML = {
	/**
	 * The `value` assigned to the menu. Used to programmatically control the menu's open state
	 * within the menubar.
	 */
	value?: string;

	children?: Snippet;
};

export type MenubarMenuProps = MenubarMenuPropsWithoutHTML;

export type MenubarTriggerPropsWithoutHTML = WithAsChild<{
	disabled?: boolean;
}>;

export type MenubarTriggerProps = MenubarTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, MenubarTriggerPropsWithoutHTML>;

export type MenubarContentPropsWithoutHTML = MenuContentPropsWithoutHTML;

export type MenubarContentProps = MenuContentProps;
