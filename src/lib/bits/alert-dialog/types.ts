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

type ActionProps = TriggerProps;

type CancelProps = TriggerProps;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes;

type PortalProps = I.PortalProps & HTMLDivAttributes;

type TitleProps = I.TitleProps & HTMLHeadingAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type ContentEvents<T extends Element = HTMLElement> = {
	pointerdown: SvelteEvent<PointerEvent, T>;
	pointerup: SvelteEvent<PointerEvent, T>;
	pointermove: SvelteEvent<PointerEvent, T>;
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
	ActionEvents,
	ContentEvents
};
