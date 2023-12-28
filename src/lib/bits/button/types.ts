import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type * as I from "./_types.js";
import type { DOMEl } from "$lib/internal/types.js";

type AnchorElement = I.Props &
	HTMLAnchorAttributes & {
		href?: HTMLAnchorAttributes["href"];
		type?: never;
	} & DOMEl<HTMLAnchorElement>;

type ButtonElement = I.Props &
	HTMLButtonAttributes & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
	} & DOMEl<HTMLButtonElement>;

type Props = AnchorElement | ButtonElement;

type ButtonEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLButtonElement;
};

type Events = {
	click: ButtonEventHandler<MouseEvent>;
	keydown: ButtonEventHandler<KeyboardEvent>;
	change: ButtonEventHandler<Event>;
	keyup: ButtonEventHandler<KeyboardEvent>;
	mouseenter: ButtonEventHandler<MouseEvent>;
	mouseleave: ButtonEventHandler<MouseEvent>;
};

export type {
	Props,
	//
	Events,
	//
	ButtonEventHandler
};
