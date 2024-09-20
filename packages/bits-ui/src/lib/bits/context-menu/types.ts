import type { MenuContentProps, MenuContentPropsWithoutHTML } from "../menu/types.js";
import type { WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type ContextMenuContentPropsWithoutHTML = Omit<
	MenuContentPropsWithoutHTML,
	"align" | "side" | "sideOffset"
>;

export type ContextMenuContentProps = Omit<
	MenuContentProps,
	"side" | "onOpenAutoFocus" | "sideOffset" | "align"
>;

export type ContextMenuTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the context menu trigger is disabled. If disabled, the trigger will not
	 * open the menu when right-clicked.
	 */
	disabled?: boolean;
}>;

export type ContextMenuTriggerProps = ContextMenuTriggerPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ContextMenuTriggerPropsWithoutHTML>;

export type {
	ArrowProps as ContextMenuArrowProps,
	ContentStaticProps as ContextMenuContentStaticProps,
	CheckboxItemProps as ContextMenuCheckboxItemProps,
	GroupProps as ContextMenuGroupProps,
	ItemProps as ContextMenuItemProps,
	GroupLabelProps as ContextMenuGroupLabelProps,
	RootProps as ContextMenuRootProps,
	RadioGroupProps as ContextMenuRadioGroupProps,
	RadioItemProps as ContextMenuRadioItemProps,
	SeparatorProps as ContextMenuSeparatorProps,
	SubContentProps as ContextMenuSubContentProps,
	SubProps as ContextMenuSubProps,
	SubTriggerProps as ContextMenuSubTriggerProps,
	PortalProps as ContextMenuPortalProps,
} from "$lib/bits/menu/index.js";

export type {
	MenuRootPropsWithoutHTML as ContextMenuRootPropsWithoutHTML,
	MenuContentStaticPropsWithoutHTML as ContextMenuContentStaticPropsWithoutHTML,
	MenuArrowPropsWithoutHTML as ContextMenuArrowPropsWithoutHTML,
	MenuCheckboxItemPropsWithoutHTML as ContextMenuCheckboxItemPropsWithoutHTML,
	MenuGroupPropsWithoutHTML as ContextMenuGroupPropsWithoutHTML,
	MenuItemPropsWithoutHTML as ContextMenuItemPropsWithoutHTML,
	MenuGroupLabelPropsWithoutHTML as ContextMenuLabelPropsWithoutHTML,
	MenuRadioGroupPropsWithoutHTML as ContextMenuRadioGroupPropsWithoutHTML,
	MenuRadioItemPropsWithoutHTML as ContextMenuRadioItemPropsWithoutHTML,
	MenuSeparatorPropsWithoutHTML as ContextMenuSeparatorPropsWithoutHTML,
	MenuSubPropsWithoutHTML as ContextMenuSubPropsWithoutHTML,
	MenuSubTriggerPropsWithoutHTML as ContextMenuSubTriggerPropsWithoutHTML,
	MenuSubContentPropsWithoutHTML as ContextMenuSubContentPropsWithoutHTML,
	MenuPortalPropsWithoutHTML as ContextMenuPortalPropsWithoutHTML,
} from "$lib/bits/menu/types.js";
