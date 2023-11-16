import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props = T.Props;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type TriggerProps = T.TriggerProps & HTMLButtonAttributes;

type CloseProps = T.ContentProps & HTMLButtonAttributes;

type ArrowProps = T.ArrowProps & HTMLDivAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type CloseEvents = TriggerEvents;

export type {
	Props,
	CloseProps,
	ArrowProps,
	ContentProps,
	TriggerProps,
	//
	Props as PopoverProps,
	ArrowProps as PopoverArrowProps,
	CloseProps as PopoverCloseProps,
	ContentProps as PopoverContentProps,
	TriggerProps as PopoverTriggerProps,
	//
	TriggerEvents,
	CloseEvents,
	//
	TriggerEvents as PopoverTriggerEvents,
	CloseEvents as PopoverCloseEvents
};
