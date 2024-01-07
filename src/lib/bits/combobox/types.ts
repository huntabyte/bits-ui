import type { HTMLDivAttributes, Transition } from "$lib/internal/index";
import type { EventHandler, HTMLInputAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index";
import type * as I from "./_types";

type Props<T, Multiple extends boolean = false> = I.Props<T, Multiple>;

type MenuProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.MenuProps<T, In, Out> & HTMLDivAttributes;

type ContentProps = I.ContentProps & HTMLDivAttributes;
type InputProps = I.InputProps & HTMLInputAttributes;
type ItemProps = I.ItemProps & HTMLDivAttributes;
type IndicatorProps = I.IndicatorProps & HTMLDivAttributes;
type LabelProps = I.LabelProps & HTMLDivAttributes;
type ArrowProps = I.ArrowProps & HTMLDivAttributes;
type HiddenInputProps = I.HiddenInputProps & HTMLInputAttributes;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	focusin: EventHandler<FocusEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
	focusout: EventHandler<FocusEvent, T>;
	pointerleave: EventHandler<PointerEvent, T>;
};

type MenuEvents<T extends Element = HTMLDivElement> = {
	pointerleave: CustomEventHandler<PointerEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
};

type InputEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLInputElement>;
	input: CustomEventHandler<InputEvent, HTMLInputElement>;
	paste: CustomEventHandler<ClipboardEvent, HTMLInputElement>;
	change: CustomEventHandler<Event, HTMLInputElement>;
	focus: CustomEventHandler<FocusEvent, HTMLInputElement>;
	blur: CustomEventHandler<FocusEvent, HTMLInputElement>;
};

export type {
	Props,
	ContentProps,
	InputProps,
	LabelProps,
	MenuProps,
	ItemProps,
	IndicatorProps,
	ArrowProps,
	HiddenInputProps,
	//
	ItemEvents,
	MenuEvents,
	InputEvents
};
