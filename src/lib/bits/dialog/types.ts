import type { HTMLDivAttributes, HTMLHeadingAttributes, Transition } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as T from "./_types.js";

type Props = T.Props;

type TriggerProps = T.TriggerProps & HTMLButtonAttributes;
type CloseProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type DescriptionProps = T.DescriptionProps & HTMLDivAttributes;

type OverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.OverlayProps<T, In, Out> & HTMLDivAttributes;

type PortalProps = T.PortalProps & HTMLDivAttributes;
type TitleProps = T.TitleProps & HTMLHeadingAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
type CloseEvents = TriggerEvents;

export type {
	Props,
	CloseProps,
	TitleProps,
	PortalProps,
	ContentProps,
	TriggerProps,
	OverlayProps,
	DescriptionProps,
	//
	Props as DialogProps,
	CloseProps as DialogCloseProps,
	TitleProps as DialogTitleProps,
	PortalProps as DialogPortalProps,
	ContentProps as DialogContentProps,
	TriggerProps as DialogTriggerProps,
	OverlayProps as DialogOverlayProps,
	DescriptionProps as DialogDescriptionProps,
	//
	TriggerEvents,
	CloseEvents,
	//
	TriggerEvents as DialogTriggerEvents,
	CloseEvents as DialogCloseEvents
};
