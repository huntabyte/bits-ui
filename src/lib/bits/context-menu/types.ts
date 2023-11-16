import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type * as T from "./_types.js";
import type { HTMLAnchorAttributes } from "svelte/elements";

type Props = T.Props;

type CheckboxItemProps = T.CheckboxItemProps & HTMLDivAttributes;

type RadioGroupProps = T.RadioGroupProps & HTMLDivAttributes;

type RadioItemProps = T.RadioItemProps & HTMLDivAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type GroupProps = T.GroupProps & HTMLDivAttributes;

type AnchorElement = HTMLAnchorAttributes & {
	href?: HTMLAnchorAttributes["href"];
};

type DivElement = HTMLDivAttributes & {
	href?: never;
};

type ItemProps = T.ItemProps & (AnchorElement | DivElement);

type CheckboxItemIndicatorProps = T.CheckboxItemIndicatorProps & HTMLDivAttributes;
type LabelProps = T.LabelProps & HTMLDivAttributes;
type SeparatorProps = T.SeparatorProps & HTMLDivAttributes;
type SubProps = T.SubProps;

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.SubContentProps<T, In, Out> & HTMLDivAttributes;

type SubTriggerProps = T.SubTriggerProps & HTMLDivAttributes;

type TriggerProps = T.TriggerProps & HTMLDivAttributes;

type ArrowProps = T.ArrowProps & HTMLDivAttributes;

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
