import type { HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	AccordionItemProps as _ItemProps,
	AccordionHeadingProps as _HeadingProps
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props<Multiple extends boolean> = T.Props<Multiple> & HTMLDivAttributes;

type ItemProps = T.ItemProps & HTMLDivAttributes;

type HeaderProps = T.HeaderProps & HTMLDivAttributes;

type TriggerProps = T.TriggerProps & HTMLButtonAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = T.ContentProps<T, In, Out> & HTMLDivAttributes;

type TriggerEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};

export type {
	Props,
	ItemProps,
	HeaderProps,
	TriggerProps,
	ContentProps,
	//
	Props as AccordionProps,
	ItemProps as AccordionItemProps,
	HeaderProps as AccordionHeaderProps,
	TriggerProps as AccordionTriggerProps,
	ContentProps as AccordionContentProps,
	//
	TriggerEvents,
	//
	TriggerEvents as AccordionTriggerEvents
};
