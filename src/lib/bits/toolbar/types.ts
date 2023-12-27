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
type ButtonEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};

type LinkEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLAnchorElement>;
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
	GroupItemEvents
};
