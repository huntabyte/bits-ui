import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { EventHandler, HTMLInputAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props<T, Multiple extends boolean = false> = I.Props<T, Multiple>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type InputProps = I.InputProps & HTMLInputAttributes;
type LabelProps = I.LabelProps & HTMLDivAttributes;

type GroupProps = I.GroupProps & HTMLDivAttributes;
type GroupLabelProps = I.GroupLabelProps & HTMLDivAttributes;

type ItemProps = I.ItemProps & HTMLDivAttributes;

type HiddenInputProps = I.HiddenInputProps & HTMLInputAttributes;
type SeparatorProps = I.SeparatorProps & HTMLDivAttributes;
type IndicatorProps = I.IndicatorProps & HTMLDivAttributes;
type ArrowProps = I.ArrowProps & HTMLDivAttributes;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	focusin: EventHandler<FocusEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
	focusout: EventHandler<FocusEvent, T>;
	pointerleave: EventHandler<PointerEvent, T>;
};

type ContentEvents<T extends Element = HTMLDivElement> = {
	pointerleave: CustomEventHandler<PointerEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
};

type GroupLabelEvents<T extends Element = HTMLSpanElement> = {
	click: CustomEventHandler<MouseEvent, T>;
};

type InputEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLInputElement>;
	input: CustomEventHandler<InputEvent, HTMLInputElement>;
	click: CustomEventHandler<ClipboardEvent, HTMLInputElement>;
};

export type {
	Props,
	ContentProps,
	InputProps,
	ItemProps,
	LabelProps,
	GroupProps,
	GroupLabelProps,
	ArrowProps,
	HiddenInputProps,
	SeparatorProps,
	IndicatorProps,
	//
	ContentEvents,
	InputEvents,
	ItemEvents,
	GroupLabelEvents,
};
