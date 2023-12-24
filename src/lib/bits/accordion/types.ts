import type { DOMEl, HTMLDivAttributes, Transition } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	AccordionItemProps as _ItemProps,
	AccordionHeadingProps as _HeadingProps
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props<Multiple extends boolean> = I.Props<Multiple> &
	HTMLDivAttributes &
	DOMEl<HTMLDivElement>;

type ItemProps = I.ItemProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type HeaderProps = I.HeaderProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = I.ContentProps<T, In, Out> & HTMLDivAttributes & DOMEl<HTMLDivElement>;

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
	TriggerEvents
};
