import type { HTMLLabelAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type { DOMElement } from "$lib/internal/types.js";

export type LabelPropsWithoutHTML = DOMElement<HTMLLabelElement>;

export type LabelProps = LabelPropsWithoutHTML & HTMLLabelAttributes;

export type LabelEvents<T extends Element = HTMLLabelElement> = {
	mousedown: CustomEventHandler<MouseEvent, T>;
};
