import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";
import type { DOMEl } from "$lib/internal/types.js";

type Props = I.Props & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type Events<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	//
	Events
};
