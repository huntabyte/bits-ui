import type { CreateToggleProps, ToggleComponentEvents } from "@melt-ui/svelte";
import type { Expand, KeydownClickEvents, OmitPressed, OnChangeFn } from "$internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: CreateToggleProps["defaultPressed"];
		onPressedChange?: OnChangeFn<CreateToggleProps["defaultPressed"]>;
		asChild?: boolean;
	}
> &
	HTMLButtonAttributes;

type Events = ToggleComponentEvents["root"] & KeydownClickEvents;

export type {
	Props,
	//
	Props as ToggleProps,
	//
	Events,
	//
	Events as ToggleEvents
};
