import type { CreateToggleProps } from "@melt-ui/svelte";
import type { Expand, OmitPressed, OnChangeFn } from "$internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: CreateToggleProps["defaultPressed"];
		onPressedChange?: OnChangeFn<CreateToggleProps["defaultPressed"]>;
		asChild?: boolean;
	}
> &
	HTMLButtonAttributes;

export type {
	Props,
	//
	Props as ToggleProps
};
