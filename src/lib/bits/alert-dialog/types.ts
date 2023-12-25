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

type ActionProps = TriggerProps & DOMEl<HTMLButtonElement>;

type CancelProps = TriggerProps & DOMEl<HTMLButtonElement>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type PortalProps = I.PortalProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type TitleProps = I.TitleProps & HTMLHeadingAttributes & DOMEl<HTMLHeadingElement>;

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
	ContentProps as OverlayProps,
	PortalProps,
	TitleProps,
	//
	TriggerEvents,
	CancelEvents,
	ActionEvents
};
