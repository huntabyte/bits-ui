import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLLabelAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLLabelAttributes;

type Events<T extends Element = HTMLLabelElement> = {
	mousedown: CustomEventHandler<MouseEvent, T>;
};

export type {
	Props,
	//
	Events
};
