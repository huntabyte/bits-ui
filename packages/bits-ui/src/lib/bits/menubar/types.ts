import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { Direction } from "$lib/shared/index.js";
import type { ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { ArrowProps } from "../menu/index.js";

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
	MenuItemPropsWithoutHTML as MenubarItemPropsWithoutHTML,
	MenuItemProps as MenubarItemProps,
	MenuGroupPropsWithoutHTML as MenubarGroupPropsWithoutHTML,
	MenuGroupProps as MenubarGroupProps,
	MenuGroupLabelPropsWithoutHTML as MenubarGroupLabelPropsWithoutHTML,
	MenuGroupLabelProps as MenubarGroupLabelProps,
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
	MenuSubTriggerPropsWithoutHTML as MenubarSubTriggerPropsWithoutHTML,
	MenuSubTriggerProps as MenubarSubTriggerProps,
	MenuSubPropsWithoutHTML as MenubarSubPropsWithoutHTML,
} from "../menu/types.js";

export type MenubarArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type MenubarArrowProps = ArrowProps;
