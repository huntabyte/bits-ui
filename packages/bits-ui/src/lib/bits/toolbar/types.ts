import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type * as I from "$lib/bits/toolbar/_types.js";
import type { CustomEventHandler } from "$lib/index.js";

type Props = I.Props & HTMLDivAttributes;

type ButtonProps = I.ButtonProps & HTMLButtonAttributes;

type LinkProps = I.LinkProps & HTMLAnchorAttributes;

type GroupProps<T extends "single" | "multiple"> = I.GroupProps<T> & HTMLDivAttributes;

type GroupItemProps = I.GroupItemProps & HTMLButtonAttributes;

/**
 * Events
 */
type HTMLEventHandler<T extends Event = Event, E extends Element = Element> = T & {
	currentTarget: EventTarget & E;
};

type ButtonEvents<T extends Element = HTMLButtonElement> = {
	click: HTMLEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type LinkEvents<T extends Element = HTMLAnchorElement> = {
	click: HTMLEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type GroupItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ButtonProps,
	LinkProps,
	GroupProps,
	GroupItemProps,
	//
	ButtonEvents,
	LinkEvents,
	GroupItemEvents,
};
