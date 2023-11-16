import type { HTMLDivAttributes, HTMLHeadingAttributes, Transition } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as T from "./_types.js";

type Props = T.Props;

type TriggerProps = T.TriggerProps & HTMLButtonAttributes;

type ActionProps = TriggerProps;

type CancelProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type DescriptionProps = T.DescriptionProps & HTMLDivAttributes;

type OverlayProps = T.OverlayProps & HTMLDivAttributes;

type PortalProps = T.PortalProps & HTMLDivAttributes;

type TitleProps = T.TitleProps & HTMLHeadingAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type ActionEvents = TriggerEvents;
type CancelEvents = TriggerEvents;

export type {
	Props,
	TriggerProps,
	ActionProps,
	CancelProps,
	ContentProps,
	DescriptionProps,
	OverlayProps,
	PortalProps,
	TitleProps,
	//
	Props as AlertDialogProps,
	TriggerProps as AlertDialogTriggerProps,
	ActionProps as AlertDialogActionProps,
	CancelProps as AlertDialogCancelProps,
	ContentProps as AlertDialogContentProps,
	DescriptionProps as AlertDialogDescriptionProps,
	OverlayProps as AlertDialogOverlayProps,
	PortalProps as AlertDialogPortalProps,
	TitleProps as AlertDialogTitleProps,
	//
	TriggerEvents,
	CancelEvents,
	ActionEvents,
	//
	TriggerEvents as AlertDialogTriggerEvents,
	CancelEvents as AlertDialogCancelEvents,
	ActionEvents as AlertDialogActionEvents
};
