import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type { HTMLAnchorAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props;

type CheckboxItemProps = I.CheckboxItemProps & HTMLDivAttributes;

type RadioGroupProps = I.RadioGroupProps & HTMLDivAttributes;

type RadioItemProps = I.RadioItemProps & HTMLDivAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type GroupProps = I.GroupProps & HTMLDivAttributes;

type AnchorElement = HTMLAnchorAttributes & {
	href?: HTMLAnchorAttributes["href"];
};

type DivElement = HTMLDivAttributes & {
	href?: never;
};

type ItemProps = I.ItemProps & (AnchorElement | DivElement);

type CheckboxItemIndicatorProps = I.CheckboxItemIndicatorProps & HTMLDivAttributes;
type LabelProps = I.LabelProps & HTMLDivAttributes;
type SeparatorProps = I.SeparatorProps & HTMLDivAttributes;
type SubProps = I.SubProps;

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.SubContentProps<T, In, Out> & HTMLDivAttributes;

type SubTriggerProps = I.SubTriggerProps & HTMLDivAttributes;

type TriggerProps = I.TriggerProps & HTMLDivAttributes;

type ArrowProps = I.ArrowProps & HTMLDivAttributes;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusin: CustomEventHandler<FocusEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

type CheckboxItemEvents = ItemEvents;
type RadioItemEvents = ItemEvents;
type SubTriggerEvents = Omit<ItemEvents, "pointerdown">;

type TriggerEvents<T extends Element = HTMLDivElement> = {
	pointerdown: CustomEventHandler<PointerEvent, T>;
	contextmenu: CustomEventHandler<Event, T>;
};

type SubContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

type ContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ArrowProps,
	CheckboxItemProps,
	ContentProps,
	GroupProps,
	ItemProps,
	CheckboxItemIndicatorProps,
	LabelProps,
	RadioGroupProps,
	RadioItemProps,
	SeparatorProps,
	SubProps,
	SubContentProps,
	SubTriggerProps,
	TriggerProps,
	//
	Props as ContextMenuProps,
	ArrowProps as ContextMenuArrowProps,
	CheckboxItemProps as ContextMenuCheckboxItemProps,
	ContentProps as ContextMenuContentProps,
	GroupProps as ContextMenuGroupProps,
	ItemProps as ContextMenuItemProps,
	CheckboxItemIndicatorProps as ContextMenuCheckboxItemIndicatorProps,
	LabelProps as ContextMenuLabelProps,
	RadioGroupProps as ContextMenuRadioGroupProps,
	RadioItemProps as ContextMenuRadioItemProps,
	SeparatorProps as ContextMenuSeparatorProps,
	SubProps as ContextMenuSubProps,
	SubContentProps as ContextMenuSubContentProps,
	SubTriggerProps as ContextMenuSubTriggerProps,
	TriggerProps as ContextMenuTriggerProps,
	//
	ContentEvents,
	CheckboxItemEvents,
	ItemEvents,
	RadioItemEvents,
	SubTriggerEvents,
	TriggerEvents,
	SubContentEvents,
	//
	ContentEvents as ContextMenuContentEvents,
	CheckboxItemEvents as ContextMenuCheckboxItemEvents,
	ItemEvents as ContextMenuItemEvents,
	RadioItemEvents as ContextMenuRadioItemEvents,
	SubTriggerEvents as ContextMenuSubTriggerEvents,
	TriggerEvents as ContextMenuTriggerEvents,
	SubContentEvents as ContextMenuSubContentEvents
};
