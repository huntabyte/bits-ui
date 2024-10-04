import type { ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { MenuArrowProps } from "../menu/types.js";
import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { Direction } from "$lib/shared/index.js";

export type MenubarRootPropsWithoutHTML = WithChild<{
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

	/**
	 * Whether or not the value state is controlled or not. If `true`, the component will not update
	 * the value state internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;
}>;

export type MenubarRootProps = MenubarRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, MenubarRootPropsWithoutHTML>;

export type MenubarMenuPropsWithoutHTML = WithChildren<{
	/**
	 * The `value` assigned to the menu. Used to programmatically control the menu's open state
	 * within the menubar.
	 */
	value?: string;
}>;

export type MenubarMenuProps = MenubarMenuPropsWithoutHTML;

export type MenubarTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger for the menubar item is disabled.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type MenubarTriggerProps = MenubarTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, MenubarTriggerPropsWithoutHTML>;

export type {
	MenuContentPropsWithoutHTML as MenubarContentPropsWithoutHTML,
	MenuContentProps as MenubarContentProps,
	MenuContentStaticPropsWithoutHTML as MenubarContentStaticPropsWithoutHTML,
	MenuContentStaticProps as MenubarContentStaticProps,
	MenuItemPropsWithoutHTML as MenubarItemPropsWithoutHTML,
	MenuItemProps as MenubarItemProps,
	MenuGroupPropsWithoutHTML as MenubarGroupPropsWithoutHTML,
	MenuGroupProps as MenubarGroupProps,
	MenuGroupHeadingPropsWithoutHTML as MenubarGroupHeadingPropsWithoutHTML,
	MenuGroupHeadingProps as MenubarGroupHeadingProps,
	MenuCheckboxItemPropsWithoutHTML as MenubarCheckboxItemPropsWithoutHTML,
	MenuCheckboxItemProps as MenubarCheckboxItemProps,
	MenuRadioGroupPropsWithoutHTML as MenubarRadioGroupPropsWithoutHTML,
	MenuRadioGroupProps as MenubarRadioGroupProps,
	MenuRadioItemPropsWithoutHTML as MenubarRadioItemPropsWithoutHTML,
	MenuRadioItemProps as MenubarRadioItemProps,
	MenuSeparatorPropsWithoutHTML as MenubarSeparatorPropsWithoutHTML,
	MenuSeparatorProps as MenubarSeparatorProps,
	MenuSubContentPropsWithoutHTML as MenubarSubContentPropsWithoutHTML,
	MenuSubContentProps as MenubarSubContentProps,
	MenuSubContentStaticPropsWithoutHTML as MenubarSubContentStaticPropsWithoutHTML,
	MenuSubContentStaticProps as MenubarSubContentStaticProps,
	MenuSubTriggerPropsWithoutHTML as MenubarSubTriggerPropsWithoutHTML,
	MenuSubTriggerProps as MenubarSubTriggerProps,
	MenuSubPropsWithoutHTML as MenubarSubPropsWithoutHTML,
	MenuPortalPropsWithoutHTML as MenubarPortalPropsWithoutHTML,
	MenuPortalProps as MenubarPortalProps,
} from "../menu/types.js";

export type MenubarArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type MenubarArrowProps = MenuArrowProps;
