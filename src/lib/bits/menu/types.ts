/**
 * These types are shared between the various menu components,
 * such as `DropdownMenu`, `Menubar` & `ContextMenu`.
 */

import type { Transition, HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type * as I from "$lib/bits/menu/_types.js";

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

// Trigger for context menu
type ContextTriggerProps = I.TriggerProps & HTMLDivAttributes;

// Trigger dropdown and menubar menus
type DropdownTriggerProps = I.TriggerProps & HTMLButtonAttributes;

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

// Trigger events used by the context menu
type ContextTriggerEvents<T extends Element = HTMLDivElement> = {
	pointerdown: CustomEventHandler<PointerEvent, T>;
	contextmenu: CustomEventHandler<Event, T>;
};

// Trigger events used by the dropdown and menubar menus
type DropdownTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
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
	ContextTriggerProps,
	DropdownTriggerProps,
	//
	ContentEvents,
	CheckboxItemEvents,
	ItemEvents,
	RadioItemEvents,
	SubTriggerEvents,
	ContextTriggerEvents,
	DropdownTriggerEvents,
	SubContentEvents
};
