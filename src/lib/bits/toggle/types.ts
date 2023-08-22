import type { CreateToggleProps } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitPressed, OnChangeFn } from "$internal/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { ButtonEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: CreateToggleProps["defaultPressed"];
		onPressedChange?: OnChangeFn<CreateToggleProps["defaultPressed"]>;
	} & AsChild
> &
	HTMLButtonAttributes;

type Events = {
	"m-click": ButtonEventHandler<MouseEvent>;
	"m-keydown": ButtonEventHandler<KeyboardEvent>;
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
