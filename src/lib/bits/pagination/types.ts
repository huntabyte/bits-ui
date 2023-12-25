import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib";
import type * as I from "./_types.js";
import type { DOMEl, HTMLDivAttributes } from "$lib/internal/types.js";

type Props = I.Props & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type PrevButtonProps = I.PrevButtonProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type NextButtonProps = I.NextButtonProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type PageProps = I.PageProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

/**
 * Events
 */
type ButtonEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
};

type PrevButtonEvents = ButtonEvents;

type NextButtonEvents = ButtonEvents;

type PageEvents = ButtonEvents;

type Events = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};

export type {
	Props,
	PageProps,
	PrevButtonProps,
	NextButtonProps,
	//
	Events,
	PageEvents,
	PrevButtonEvents,
	NextButtonEvents
};
