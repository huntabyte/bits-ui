import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { HTMLAnchorAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props = T.Props;

type TriggerProps = T.TriggerProps & HTMLAnchorAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type ArrowProps = T.ArrowProps & HTMLDivAttributes;

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
	Props as LinkPreviewProps,
	ArrowProps as LinkPreviewArrowProps,
	TriggerProps as LinkPreviewTriggerProps,
	ContentProps as LinkPreviewContentProps,
	//
	TriggerEvents,
	ContentEvents,
	//
	TriggerEvents as LinkPreviewTriggerEvents,
	ContentEvents as LinkPreviewContentEvents
};
