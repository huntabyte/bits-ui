import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes & DOMEl;

type ContentProps = I.ContentProps & HTMLDivAttributes & DOMEl;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes & DOMEl<HTMLButtonElement>;

type ListProps = I.ListProps & HTMLDivAttributes & DOMEl;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
};

export type {
	Props,
	ContentProps,
	TriggerProps,
	ListProps,
	//
	TriggerEvents
};
