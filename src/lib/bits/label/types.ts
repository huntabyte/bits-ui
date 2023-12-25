import type { CustomEventHandler } from "$lib";
import type { HTMLLabelAttributes } from "svelte/elements";
import type * as I from "./_types.js";
import type { DOMEl } from "$lib/internal/types.js";

type Props = I.Props & HTMLLabelAttributes & DOMEl<HTMLLabelElement>;

type Events<T extends Element = HTMLLabelElement> = {
	mousedown: CustomEventHandler<MouseEvent, T>;
};

export type {
	Props,
	//
	Events
};
