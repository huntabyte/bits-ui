/**
 * These types are shared between the various menu components,
 * such as `DropdownMenu`, `Menubar` & `ContextMenu`.
 */

import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type * as I from "$lib/bits/menu/_types.js";
import type { ContentProps } from "$lib/bits/floating/types.js";

type Props = I.Props;

type CheckboxItemProps = I.CheckboxItemProps & HTMLDivAttributes;

type RadioGroupProps = I.RadioGroupProps & HTMLDivAttributes;

type RadioItemProps = I.RadioItemProps & HTMLDivAttributes;

type GroupProps = I.GroupProps & HTMLDivAttributes;

type AnchorElement = HTMLAnchorAttributes & {
	href?: HTMLAnchorAttributes["href"];
} & DOMEl<HTMLAnchorElement>;

type DivElement = HTMLDivAttributes & {
	href?: never;
} & DOMEl;

type ItemProps = Omit<I.ItemProps, "el"> & (AnchorElement | DivElement);

type CheckboxIndicatorProps = I.CheckboxIndicatorProps & HTMLDivAttributes;

type RadioIndicatorProps = I.RadioIndicatorProps & HTMLDivAttributes;

type LabelProps = I.LabelProps & HTMLDivAttributes;

type SeparatorProps = I.SeparatorProps & HTMLDivAttributes;

type SubProps = I.SubProps;

type SubTriggerProps = I.SubTriggerProps & HTMLDivAttributes;

// Trigger for context menu
type ContextTriggerProps = Omit<I.TriggerProps, "el"> & HTMLDivAttributes & DOMEl;

// Trigger for dropdown menu & menubar menu
type DropdownTriggerProps = Omit<I.TriggerProps, "el"> &
	HTMLButtonAttributes &
	DOMEl<HTMLButtonElement>;

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

// Trigger events used by the dropdown
type DropdownTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

// Trigger events used by the menubar
type MenubarTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
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
	CheckboxIndicatorProps,
	RadioIndicatorProps,
	LabelProps,
	RadioGroupProps,
	RadioItemProps,
	SeparatorProps,
	SubProps,
	ContentProps as SubContentProps,
	SubTriggerProps,
	ContextTriggerProps,
	DropdownTriggerProps,
	DropdownTriggerProps as MenubarTriggerProps,
	//
	ContentEvents,
	CheckboxItemEvents,
	ItemEvents,
	RadioItemEvents,
	SubTriggerEvents,
	ContextTriggerEvents,
	DropdownTriggerEvents,
	MenubarTriggerEvents,
	SubContentEvents
};
