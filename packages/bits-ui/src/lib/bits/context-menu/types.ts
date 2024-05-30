import type { MenuContentProps, MenuContentPropsWithoutHTML } from "../menu/types.js";
import type { PrimitiveDivAttributes, WithAsChild, Without } from "$lib/internal/types.js";

export type ContextMenuContentPropsWithoutHTML = MenuContentPropsWithoutHTML;

export type ContextMenuContentProps = Omit<
	MenuContentProps,
	"side" | "onMountAutoFocus" | "sideOffset" | "align"
>;

export type ContextMenuTriggerPropsWithoutHTML = WithAsChild<{
	disabled?: boolean;
}>;
export type ContextMenuTriggerProps = ContextMenuTriggerPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ContextMenuTriggerPropsWithoutHTML>;

export type {
	ArrowProps as ContextMenuArrowProps,
	CheckboxItemProps as ContextMenuCheckboxItemProps,
	GroupProps as ContextMenuGroupProps,
	ItemProps as ContextMenuItemProps,
	LabelProps as ContextMenuLabelProps,
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
	MenuArrowPropsWithoutHTML as ContextMenuArrowPropsWithoutHTML,
	MenuCheckboxItemPropsWithoutHTML as ContextMenuCheckboxItemPropsWithoutHTML,
	MenuGroupPropsWithoutHTML as ContextMenuGroupPropsWithoutHTML,
	MenuItemPropsWithoutHTML as ContextMenuItemPropsWithoutHTML,
	MenuLabelPropsWithoutHTML as ContextMenuLabelPropsWithoutHTML,
	MenuRadioGroupPropsWithoutHTML as ContextMenuRadioGroupPropsWithoutHTML,
	MenuRadioItemPropsWithoutHTML as ContextMenuRadioItemPropsWithoutHTML,
	MenuSeparatorPropsWithoutHTML as ContextMenuSeparatorPropsWithoutHTML,
	MenuSubPropsWithoutHTML as ContextMenuSubPropsWithoutHTML,
	MenuSubTriggerPropsWithoutHTML as ContextMenuSubTriggerPropsWithoutHTML,
	MenuSubContentPropsWithoutHTML as ContextMenuSubContentPropsWithoutHTML,
	MenuPortalPropsWithoutHTML as ContextMenuPortalPropsWithoutHTML,
} from "$lib/bits/menu/types.js";
