import type { DOMEl, HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type {
	EventHandler,
	HTMLAttributes,
	HTMLButtonAttributes,
	HTMLInputAttributes
} from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props<T, Multiple extends boolean = false> = I.Props<T, Multiple>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes & DOMEl;

type GroupProps = I.GroupProps & HTMLDivAttributes & DOMEl;
type InputProps = I.InputProps & HTMLInputAttributes & DOMEl<HTMLInputElement>;
type LabelProps = I.LabelProps & HTMLDivAttributes & DOMEl;
type ItemProps = I.ItemProps & HTMLDivAttributes & DOMEl;
type SeparatorProps = I.SeparatorProps & HTMLDivAttributes & DOMEl;
type TriggerProps = I.TriggerProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type ValueProps = I.ValueProps & HTMLAttributes<HTMLSpanElement> & DOMEl<HTMLSpanElement>;

type ArrowProps = I.ArrowProps & HTMLDivAttributes & DOMEl;

type IndicatorProps = I.IndicatorProps & HTMLDivAttributes & DOMEl;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
	focusin: EventHandler<FocusEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
	focusout: EventHandler<FocusEvent, T>;
	pointerleave: EventHandler<PointerEvent, T>;
};

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type LabelEvents<T extends Element = HTMLSpanElement> = {
	click: CustomEventHandler<MouseEvent, T>;
};
type ContentEvents<T extends Element = HTMLDivElement> = {
	pointerleave: CustomEventHandler<PointerEvent, T>;
	keydown: EventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ArrowProps,
	ContentProps,
	GroupProps,
	InputProps,
	LabelProps,
	ItemProps,
	IndicatorProps,
	SeparatorProps,
	TriggerProps,
	ValueProps,
	//
	ItemEvents,
	ContentEvents,
	TriggerEvents,
	LabelEvents
};
