import type { CustomEventHandler } from "$lib";
import type { AsChild } from "$lib/internal/types.js";
import type { HTMLLabelAttributes } from "svelte/elements";

type Props = AsChild & HTMLLabelAttributes;
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
