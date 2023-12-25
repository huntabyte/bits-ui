import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type IndicatorProps = I.IndicatorProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type InputProps = Omit<HTMLInputAttributes, "value"> & DOMEl<HTMLInputElement>;

type Events = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};

export type {
	Props,
	IndicatorProps,
	InputProps,
	//
	Events
};
