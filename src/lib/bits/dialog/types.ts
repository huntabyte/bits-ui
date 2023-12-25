import type {
	DOMEl,
	HTMLDivAttributes,
	HTMLHeadingAttributes,
	Transition
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props = I.Props;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;
type CloseProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type OverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.OverlayProps<T, In, Out> & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type PortalProps = I.PortalProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;
type TitleProps = I.TitleProps & HTMLHeadingAttributes & DOMEl<HTMLHeadingElement>;

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
	TriggerEvents,
	CloseEvents
};
