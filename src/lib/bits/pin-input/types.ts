import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type { HTMLInputAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes;

type InputProps = I.InputProps & HTMLInputAttributes;

type HiddenInputProps = I.HiddenInputProps & HTMLInputAttributes;

type InputEvents = {
	keydown: CustomEventHandler<KeyboardEvent, HTMLInputElement>;
	input: CustomEventHandler<InputEvent, HTMLInputElement>;
	paste: CustomEventHandler<ClipboardEvent, HTMLInputElement>;
	change: CustomEventHandler<Event, HTMLInputElement>;
	focus: CustomEventHandler<FocusEvent, HTMLInputElement>;
	blur: CustomEventHandler<FocusEvent, HTMLInputElement>;
};

export type {
	Props,
	InputProps,
	HiddenInputProps,
	//
	InputEvents
};
