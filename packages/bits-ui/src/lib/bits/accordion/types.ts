import type { HTMLButtonAttributes } from "svelte/elements";
import type * as I from "./_types.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";

type Props<Multiple extends boolean> = I.Props<Multiple> & Omit<HTMLDivAttributes, "type">;

type ItemProps = I.ItemProps & HTMLDivAttributes;

type HeaderProps = I.HeaderProps & HTMLDivAttributes;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type TriggerEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};

export type {
	ContentProps,
	HeaderProps,
	ItemProps,
	Props,
	//
	TriggerEvents,
	TriggerProps,
};
