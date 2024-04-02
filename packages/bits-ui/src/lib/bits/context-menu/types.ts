import type {
	DOMElement,
	HTMLDivAttributes,
	Transition,
	TransitionProps,
} from "$lib/internal/index.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

export type {
	ArrowProps as ContextMenuArrowProps,
	CheckboxIndicatorProps as ContextMenuCheckboxIndicatorProps,
	CheckboxItemEvents as ContextMenuCheckboxItemEvents,
	CheckboxItemProps as ContextMenuCheckboxItemProps,
	ContentEvents as ContextMenuContentEvents,
	GroupProps as ContextMenuGroupProps,
	ItemEvents as ContextMenuItemEvents,
	ItemProps as ContextMenuItemProps,
	LabelProps as ContextMenuLabelProps,
	Props as ContextMenuProps,
	RadioGroupProps as ContextMenuRadioGroupProps,
	RadioIndicatorProps as ContextMenuRadioIndicatorProps,
	RadioItemEvents as ContextMenuRadioItemEvents,
	RadioItemProps as ContextMenuRadioItemProps,
	SeparatorProps as ContextMenuSeparatorProps,
	SubContentEvents as ContextMenuSubContentEvents,
	SubContentProps as ContextMenuSubContentProps,
	SubProps as ContextMenuSubProps,
	SubTriggerEvents as ContextMenuSubTriggerEvents,
	SubTriggerProps as ContextMenuSubTriggerProps,
	ContextTriggerEvents as ContextMenuTriggerEvents,
	ContextTriggerProps as ContextMenuTriggerProps,
} from "$lib/bits/menu/index.js";

type ContextFloatingProps = Omit<FloatingProps, "sameWidth" | "side" | "sideOffset" | "align">;

export type ContextMenuContentPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<ContextFloatingProps & TransitionProps<T, In, Out> & DOMElement>;

export type ContextMenuContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = ContextMenuContentPropsWithoutHTML<T, In, Out> & HTMLDivAttributes;

export type {
	MenuTriggerPropsWithoutHTML as ContextMenuTriggerPropsWithoutHTML,
	MenuArrowPropsWithoutHTML as ContextMenuArrowPropsWithoutHTML,
	MenuCheckboxIndicatorPropsWithoutHTML as ContextMenuCheckboxIndicatorPropsWithoutHTML,
	MenuCheckboxItemPropsWithoutHTML as ContextMenuCheckboxItemPropsWithoutHTML,
	MenuGroupPropsWithoutHTML as ContextMenuGroupPropsWithoutHTML,
	MenuItemPropsWithoutHTML as ContextMenuItemPropsWithoutHTML,
	MenuLabelPropsWithoutHTML as ContextMenuLabelPropsWithoutHTML,
	MenuPropsWithoutHTML as ContextMenuPropsWithoutHTML,
	MenuRadioGroupPropsWithoutHTML as ContextMenuRadioGroupPropsWithoutHTML,
	MenuRadioIndicatorPropsWithoutHTML as ContextMenuRadioIndicatorPropsWithoutHTML,
	MenuRadioItemPropsWithoutHTML as ContextMenuRadioItemPropsWithoutHTML,
	MenuSeparatorPropsWithoutHTML as ContextMenuSeparatorPropsWithoutHTML,
	MenuSubContentPropsWithoutHTML as ContextMenuSubContentPropsWithoutHTML,
	MenuSubPropsWithoutHTML as ContextMenuSubPropsWithoutHTML,
	MenuSubTriggerPropsWithoutHTML as ContextMenuSubTriggerPropsWithoutHTML,
} from "$lib/bits/menu/types.js";
