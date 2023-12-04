import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { HTMLAnchorAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props;

type TriggerProps = I.TriggerProps & HTMLAnchorAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type ArrowProps = I.ArrowProps & HTMLDivAttributes;

type TriggerEvents<T extends Element = HTMLAnchorElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	blur: CustomEventHandler<FocusEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
};
type ContentEvents<T extends Element = HTMLDivElement> = {
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerenter: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
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
