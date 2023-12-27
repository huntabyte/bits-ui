import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib";
import type * as I from "./_types.js";
import type { HTMLDivAttributes } from "$lib/internal/types.js";

type Props = I.Props & HTMLDivAttributes;

type PrevButtonProps = I.PrevButtonProps & HTMLButtonAttributes;

type NextButtonProps = I.NextButtonProps & HTMLButtonAttributes;

type PageProps = I.PageProps & HTMLButtonAttributes;

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
