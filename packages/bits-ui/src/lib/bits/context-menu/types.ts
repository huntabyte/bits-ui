import type {
	DOMElement,
	HTMLDivAttributes,
	Transition,
	TransitionProps,
} from "$lib/internal/index.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

export type {
	ArrowProps as ContextMenuArrowProps,
	CheckboxItemProps as ContextMenuCheckboxItemProps,
	GroupProps as ContextMenuGroupProps,
	ItemProps as ContextMenuItemProps,
	LabelProps as ContextMenuLabelProps,
	RootProps as ContextMenuProps,
	RadioGroupProps as ContextMenuRadioGroupProps,
	RadioItemProps as ContextMenuRadioItemProps,
	SeparatorProps as ContextMenuSeparatorProps,
	SubContentProps as ContextMenuSubContentProps,
	SubProps as ContextMenuSubProps,
	SubTriggerProps as ContextMenuSubTriggerProps,
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
	MenuCheckboxItemPropsWithoutHTML as ContextMenuCheckboxItemPropsWithoutHTML,
	MenuGroupPropsWithoutHTML as ContextMenuGroupPropsWithoutHTML,
	MenuItemPropsWithoutHTML as ContextMenuItemPropsWithoutHTML,
	MenuLabelPropsWithoutHTML as ContextMenuLabelPropsWithoutHTML,
	MenuRootPropsWithoutHTML as ContextMenuPropsWithoutHTML,
	MenuRadioGroupPropsWithoutHTML as ContextMenuRadioGroupPropsWithoutHTML,
	MenuRadioItemPropsWithoutHTML as ContextMenuRadioItemPropsWithoutHTML,
	MenuSeparatorPropsWithoutHTML as ContextMenuSeparatorPropsWithoutHTML,
	MenuSubContentPropsWithoutHTML as ContextMenuSubContentPropsWithoutHTML,
	MenuSubPropsWithoutHTML as ContextMenuSubPropsWithoutHTML,
	MenuSubTriggerPropsWithoutHTML as ContextMenuSubTriggerPropsWithoutHTML,
} from "$lib/bits/menu/types.js";
