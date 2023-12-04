import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props<T extends "single" | "multiple"> = I.Props<T> & HTMLDivAttributes;

type ItemProps = I.ItemProps & HTMLButtonAttributes;

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
