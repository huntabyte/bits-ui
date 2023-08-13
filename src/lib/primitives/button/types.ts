import type { Builder } from "$internal/index.js";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

type Builders = {
	builders?: Builder[];
	builder?: Builder;
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
type Events = {
	click: MouseEvent;
	change: Event;
	keydown: KeyboardEvent;
	keyup: KeyboardEvent;
	mouseenter: MouseEvent;
	mouseleave: MouseEvent;
};

export type {
	Props,
	//
	Props as ButtonProps,
	//
	Events,
	//
	Events as ButtonEvents
};
