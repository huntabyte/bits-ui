import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type * as I from "./_types.js";
import type { ContentProps } from "$lib/bits/floating/types.js";

type Props = I.Props;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;

type CloseProps = I.ContentProps & HTMLButtonAttributes;

type ArrowProps = I.ArrowProps & HTMLDivAttributes;

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
