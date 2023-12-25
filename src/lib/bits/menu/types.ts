/**
 * These types are shared between the various menu components,
 * such as `DropdownMenu`, `Menubar` & `ContextMenu`.
 */

import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type * as I from "$lib/bits/menu/_types.js";
import type { ContentProps } from "$lib/bits/floating/types.js";

type Props = I.Props & DOMEl;

type CheckboxItemProps = I.CheckboxItemProps & HTMLDivAttributes & DOMEl;

type RadioGroupProps = I.RadioGroupProps & HTMLDivAttributes & DOMEl;

type RadioItemProps = I.RadioItemProps & HTMLDivAttributes & DOMEl;

type GroupProps = I.GroupProps & HTMLDivAttributes & DOMEl;

type AnchorElement = HTMLAnchorAttributes & {
	href?: HTMLAnchorAttributes["href"];
} & DOMEl<HTMLAnchorElement>;

type DivElement = HTMLDivAttributes & {
	href?: never;
} & DOMEl;

type ItemProps = I.ItemProps & (AnchorElement | DivElement);

type CheckboxIndicatorProps = I.CheckboxIndicatorProps & HTMLDivAttributes & DOMEl;

type RadioIndicatorProps = I.RadioIndicatorProps & HTMLDivAttributes & DOMEl;

type LabelProps = I.LabelProps & HTMLDivAttributes & DOMEl;

type SeparatorProps = I.SeparatorProps & HTMLDivAttributes & DOMEl;

type SubProps = I.SubProps & DOMEl;

type SubTriggerProps = I.SubTriggerProps & HTMLDivAttributes & DOMEl;

// Trigger for context menu
type ContextTriggerProps = I.TriggerProps & HTMLDivAttributes & DOMEl;

// Trigger for dropdown menu & menubar menu
type DropdownTriggerProps = I.TriggerProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type ArrowProps = I.ArrowProps & HTMLDivAttributes & DOMEl;

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
