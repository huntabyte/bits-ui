import type {
	HTMLDivAttributes,
	HTMLHeadingAttributes,
	SvelteEvent,
	Transition
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props = I.Props;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;
type CloseProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes;

type OverlayProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.OverlayProps<T, In, Out> & HTMLDivAttributes;

type PortalProps = I.PortalProps & HTMLDivAttributes;
type TitleProps = I.TitleProps & HTMLHeadingAttributes;

type OverlayEvents<T extends Element = HTMLElement> = {
	mouseup: SvelteEvent<MouseEvent, T>;
};

type ContentEvents<T extends Element = HTMLElement> = {
	pointerdown: SvelteEvent<PointerEvent, T>;
	pointerup: SvelteEvent<PointerEvent, T>;
	pointermove: SvelteEvent<PointerEvent, T>;
};

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
	CloseEvents,
	ContentEvents,
	OverlayEvents
};
