import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
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
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type GroupProps = I.GroupProps & HTMLDivAttributes;
type InputProps = I.InputProps & HTMLInputAttributes;
type LabelProps = I.LabelProps & HTMLDivAttributes;
type ItemProps = I.ItemProps & HTMLDivAttributes;
type SeparatorProps = I.SeparatorProps & HTMLDivAttributes;
type TriggerProps = I.TriggerProps & HTMLButtonAttributes;

type ValueProps = I.ValueProps & HTMLAttributes<HTMLSpanElement>;

type ArrowProps = I.ArrowProps & HTMLDivAttributes;

type IndicatorProps = I.IndicatorProps & HTMLDivAttributes;

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
