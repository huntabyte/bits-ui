import type { CreateToggleProps, ToggleComponentEvents } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitPressed, OnChangeFn } from "$internal/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: CreateToggleProps["defaultPressed"];
		onPressedChange?: OnChangeFn<CreateToggleProps["defaultPressed"]>;
	} & AsChild
> &
	HTMLButtonAttributes;

type Events = ToggleComponentEvents["root"];

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
