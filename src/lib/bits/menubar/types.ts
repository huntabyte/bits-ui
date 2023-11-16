import type { Expand, HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

import type { HTMLButtonAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes;

type MenuProps = I.MenuProps;

type CheckboxItemProps = I.CheckboxItemProps & HTMLDivAttributes;

type RadioGroupProps = I.RadioGroupProps & HTMLDivAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type GroupProps = I.GroupProps & HTMLDivAttributes;

type ItemProps = I.ItemProps & HTMLDivAttributes;

type CheckboxItemIndicatorProps = I.CheckboxIndicatorProps & HTMLDivAttributes;

type LabelProps = I.LabelProps & HTMLDivAttributes;

type RadioItemProps = I.RadioItemProps & HTMLDivAttributes;

type SeparatorProps = I.SeparatorProps & HTMLDivAttributes;

type SubProps = I.SubProps;

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.SubContentProps<T, In, Out> & HTMLDivAttributes;

type SubTriggerProps = I.SubTriggerProps & HTMLDivAttributes;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;

type ArrowProps = I.ArrowProps & HTMLDivAttributes;

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
