import type { CreateMenubarProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, HTMLDivAttributes, OmitIds } from "$lib/internal/index.js";

export type {
	MenuArrowProps as MenubarMenuArrowProps,
	MenuCheckboxIndicatorProps as MenubarMenuCheckboxIndicatorProps,
	MenuCheckboxItemEvents as MenubarMenuCheckboxItemEvents,
	MenuCheckboxItemProps as MenubarMenuCheckboxItemProps,
	MenuContentEvents as MenubarMenuContentEvents,
	MenuContentProps as MenubarMenuContentProps,
	MenuGroupProps as MenubarMenuGroupProps,
	MenuItemEvents as MenubarMenuItemEvents,
	MenuItemProps as MenubarMenuItemProps,
	MenuLabelProps as MenubarMenuLabelProps,
	MenuProps as MenubarMenuProps,
	MenuRadioGroupProps as MenubarMenuRadioGroupProps,
	MenuRadioIndicatorProps as MenubarMenuRadioIndicatorProps,
	MenuRadioItemEvents as MenubarMenuRadioItemEvents,
	MenuRadioItemProps as MenubarMenuRadioItemProps,
	MenuSeparatorProps as MenubarMenuSeparatorProps,
	MenuSubContentEvents as MenubarMenuSubContentEvents,
	MenuSubContentProps as MenubarMenuSubContentProps,
	MenuSubProps as MenubarMenuSubProps,
	MenuSubTriggerEvents as MenubarMenuSubTriggerEvents,
	MenuSubTriggerProps as MenubarMenuSubTriggerProps,
	MenubarTriggerEvents,
	MenubarTriggerProps,
} from "$lib/bits/menu/types.js";

export type {
	MenuArrowPropsWithoutHTML as MenubarMenuArrowPropsWithoutHTML,
	MenuCheckboxIndicatorPropsWithoutHTML as MenubarMenuCheckboxIndicatorPropsWithoutHTML,
	MenuCheckboxItemPropsWithoutHTML as MenubarMenuCheckboxItemPropsWithoutHTML,
	MenuContentPropsWithoutHTML as MenubarMenuContentPropsWithoutHTML,
	MenuGroupPropsWithoutHTML as MenubarMenuGroupPropsWithoutHTML,
	MenuItemPropsWithoutHTML as MenubarMenuItemPropsWithoutHTML,
	MenuLabelPropsWithoutHTML as MenubarMenuLabelPropsWithoutHTML,
	MenuPropsWithoutHTML as MenubarMenuPropsWithoutHTML,
	MenuRadioGroupPropsWithoutHTML as MenubarMenuRadioGroupPropsWithoutHTML,
	MenuRadioIndicatorPropsWithoutHTML as MenubarMenuRadioIndicatorPropsWithoutHTML,
	MenuRadioItemPropsWithoutHTML as MenubarMenuRadioItemPropsWithoutHTML,
	MenuSeparatorPropsWithoutHTML as MenubarMenuSeparatorPropsWithoutHTML,
	MenuSubContentPropsWithoutHTML as MenubarMenuSubContentPropsWithoutHTML,
	MenuSubPropsWithoutHTML as MenubarMenuSubPropsWithoutHTML,
	MenuSubTriggerPropsWithoutHTML as MenubarMenuSubTriggerPropsWithoutHTML,
} from "$lib/bits/menu/types.js";

export type MenubarPropsWithoutHTML = Expand<OmitIds<CreateMenubarProps> & DOMElement>;

export type MenubarProps = MenubarPropsWithoutHTML & HTMLDivAttributes;
