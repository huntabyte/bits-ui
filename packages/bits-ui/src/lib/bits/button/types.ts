import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type { DOMEl } from "$lib/internal/types.js";
import type { Builder } from "$lib/internal/index.js";

type ButtonPropsWithoutHTML = {
	/**
	 * Melt UI builders to apply to the button component.
	 */
	builders?: Builder[];
};

type AnchorElement = ButtonPropsWithoutHTML &
	HTMLAnchorAttributes & {
		href?: HTMLAnchorAttributes["href"];
		type?: never;
	} & DOMEl<HTMLAnchorElement>;

type ButtonElement = ButtonPropsWithoutHTML &
	HTMLButtonAttributes & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
	} & DOMEl<HTMLButtonElement>;

export type ButtonProps = AnchorElement | ButtonElement;

export type ButtonEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLButtonElement;
};

export type ButtonEvents = {
	click: ButtonEventHandler<MouseEvent>;
	keydown: ButtonEventHandler<KeyboardEvent>;
	change: ButtonEventHandler<Event>;
	keyup: ButtonEventHandler<KeyboardEvent>;
	mouseenter: ButtonEventHandler<MouseEvent>;
	mouseleave: ButtonEventHandler<MouseEvent>;
};
