import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type AnchorElement = T.Props &
	HTMLAnchorAttributes & {
		href?: HTMLAnchorAttributes["href"];
		type?: never;
	};

type ButtonElement = T.Props &
	HTMLButtonAttributes & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
	};

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
	Props as ButtonProps,
	//
	Events,
	//
	Events as ButtonEvents,
	//
	ButtonEventHandler
};
