import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;

type TriggerEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
};

export type {
	Props,
	ContentProps,
	TriggerProps,
	//
	TriggerEvents
};
