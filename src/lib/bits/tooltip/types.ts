import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib";
import type * as I from "./_types.js";

type Props = I.Props;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;
type ArrowProps = I.ArrowProps & HTMLDivAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	blur: CustomEventHandler<FocusEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
};

type ContentEvents<T extends Element = HTMLDivElement> = {
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
};

export type {
	Props,
	ArrowProps,
	TriggerProps,
	ContentProps,
	//
	TriggerEvents,
	ContentEvents
};
