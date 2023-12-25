import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props<T extends "single" | "multiple"> = I.Props<T> & HTMLDivAttributes & DOMEl;

type ItemProps = I.ItemProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type ItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ItemProps,
	//
	ItemEvents
};
