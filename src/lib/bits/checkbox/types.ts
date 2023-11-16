import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props = T.Props & HTMLButtonAttributes;

type IndicatorProps = T.IndicatorProps & HTMLDivAttributes;

type InputProps = Omit<HTMLInputAttributes, "value">;

type Events = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};

export type {
	Props,
	IndicatorProps,
	InputProps,
	//
	Props as CheckboxProps,
	IndicatorProps as CheckboxIndicatorProps,
	InputProps as CheckboxInputProps,
	//
	Events,
	//
	Events as CheckboxEvents
};
