import type { Builder } from "$internal/index.js";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

type Builders = {
	builders?: Builder[];
};

interface AnchorElement extends Builders, HTMLAnchorAttributes {
	href?: HTMLAnchorAttributes["href"];
	type?: never;
}

interface ButtonElement extends Builders, HTMLButtonAttributes {
	type?: HTMLButtonAttributes["type"];
	href?: never;
}

type Props = AnchorElement | ButtonElement;

type ButtonEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLButtonElement;
};

type Events = {
	click: ButtonEventHandler<MouseEvent>;
	keydown: ButtonEventHandler<KeyboardEvent>;
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
