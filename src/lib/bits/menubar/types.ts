import type { Expand, HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

import type { HTMLButtonAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props = T.Props & HTMLDivAttributes;

type MenuProps = T.MenuProps;

type CheckboxItemProps = T.CheckboxItemProps & HTMLDivAttributes;

type RadioGroupProps = T.RadioGroupProps & HTMLDivAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type GroupProps = T.GroupProps & HTMLDivAttributes;

type ItemProps = T.ItemProps & HTMLDivAttributes;

type CheckboxItemIndicatorProps = T.CheckboxIndicatorProps & HTMLDivAttributes;

type LabelProps = T.LabelProps & HTMLDivAttributes;

type RadioItemProps = T.RadioItemProps & HTMLDivAttributes;

type SeparatorProps = T.SeparatorProps & HTMLDivAttributes;

type SubProps = T.SubProps;

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.SubContentProps<T, In, Out> & HTMLDivAttributes;

type SubTriggerProps = T.SubTriggerProps & HTMLDivAttributes;

type TriggerProps = T.TriggerProps & HTMLButtonAttributes;

type ArrowProps = T.ArrowProps & HTMLDivAttributes;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<PointerEvent, T>;
	focusin: CustomEventHandler<FocusEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

type SubTriggerEvents<T extends Element = HTMLDivElement> = Expand<
	Omit<ItemEvents<T>, "pointerdown">
>;

type CheckboxItemEvents = ItemEvents;
type RadioItemEvents = ItemEvents;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
	click: CustomEventHandler<MouseEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
};

type ContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type SubContentEvents<T extends Element = HTMLDivElement> = {
	focusout: CustomEventHandler<FocusEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	SubProps,
	MenuProps,
	ItemProps,
	ArrowProps,
	GroupProps,
	LabelProps,
	TriggerProps,
	ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	CheckboxItemIndicatorProps,

	//
	Props as MenubarProps,
	SubProps as MenubarSubProps,
	MenuProps as MenubarMenuProps,
	ItemProps as MenubarItemProps,
	ArrowProps as MenubarArrowProps,
	GroupProps as MenubarGroupProps,
	LabelProps as MenubarLabelProps,
	ContentProps as MenubarContentProps,
	TriggerProps as MenubarTriggerProps,
	RadioItemProps as MenubarRadioItemProps,
	SeparatorProps as MenubarSeparatorProps,
	SubContentProps as MenubarSubContentProps,
	SubTriggerProps as MenubarSubTriggerProps,
	RadioGroupProps as MenubarRadioGroupProps,
	CheckboxItemProps as MenubarCheckboxItemProps,
	CheckboxItemIndicatorProps as MenubarCheckboxItemIndicatorProps,
	//
	TriggerEvents,
	ItemEvents,
	SubTriggerEvents,
	CheckboxItemEvents,
	RadioItemEvents,
	ContentEvents,
	SubContentEvents,
	//
	TriggerEvents as MenubarTriggerEvents,
	ItemEvents as MenubarItemEvents,
	SubTriggerEvents as MenubarSubTriggerEvents,
	CheckboxItemEvents as MenubarCheckboxItemEvents,
	RadioItemEvents as MenubarRadioItemEvents,
	ContentEvents as MenubarContentEvents,
	SubContentEvents as MenubarSubContentEvents
};
