import type { CreateToggleProps, ToggleComponentEvents } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitPressed, OnChangeFn } from "$internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: CreateToggleProps["defaultPressed"];
		onPressedChange?: OnChangeFn<CreateToggleProps["defaultPressed"]>;
	}
> &
	AsChild &
	HTMLButtonAttributes;

type Events = ToggleComponentEvents["root"];

export type {
	Props,
	//
	Props as ToggleProps,
	//
	Events,
	//
	Events as ToggleEvents
};
