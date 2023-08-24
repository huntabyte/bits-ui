import type { CreateToggleProps } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitPressed, OnChangeFn } from "$lib/internal/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: CreateToggleProps["defaultPressed"];
		onPressedChange?: OnChangeFn<CreateToggleProps["defaultPressed"]>;
	} & AsChild
> &
	HTMLButtonAttributes;

type Events<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type InputProps = Omit<HTMLInputAttributes, "value">;

export type {
	Props,
	InputProps,
	//
	Props as ToggleProps,
	InputProps as ToggleInputProps,
	//
	Events,
	//
	Events as ToggleEvents
};
