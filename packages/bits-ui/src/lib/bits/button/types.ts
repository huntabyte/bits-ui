import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

export type ButtonPropsWithoutHTML = {
	ref?: HTMLElement | null;
};

type AnchorElement = ButtonPropsWithoutHTML &
	HTMLAnchorAttributes & {
		href?: HTMLAnchorAttributes["href"];
		type?: never;
	};

type ButtonElement = ButtonPropsWithoutHTML &
	HTMLButtonAttributes & {
		type?: HTMLButtonAttributes["type"];
		href?: never;
	};

export type ButtonProps = AnchorElement | ButtonElement;

export type ButtonEventHandler<T extends Event = Event> = T & {
	currentTarget: EventTarget & HTMLButtonElement;
};
