import type { CustomEventHandler } from "$lib";
import type { HTMLLabelAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props = T.Props & HTMLLabelAttributes;

type Events<T extends Element = HTMLLabelElement> = {
	mousedown: CustomEventHandler<MouseEvent, T>;
};

export type {
	Props,
	//
	Props as LabelProps,
	//
	Events,
	//
	Events as LabelEvents
};
