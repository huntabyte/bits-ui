import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes;

type ContentProps = I.ContentProps & HTMLDivAttributes;

type TriggerProps = I.TriggerProps & HTMLButtonAttributes;

type ListProps = I.ListProps & HTMLDivAttributes;

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
