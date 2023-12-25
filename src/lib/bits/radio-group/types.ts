import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes & DOMEl;

type InputProps = I.InputProps & HTMLInputAttributes & DOMEl<HTMLInputElement>;

type ItemProps = I.ItemProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type ItemIndicatorProps = I.ItemIndicatorProps & HTMLDivAttributes & DOMEl;

type ItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
};

export type {
	Props,
	InputProps,
	ItemProps,
	ItemIndicatorProps,
	//
	ItemEvents
};
