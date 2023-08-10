import type { CreateSwitchProps } from "@melt-ui/svelte";
import type { Expand, HTMLSpanAttributes, OmitChecked, OnChangeFn } from "$internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitChecked<CreateSwitchProps> & {
		checked?: CreateSwitchProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateSwitchProps["defaultChecked"]>;
	}
> &
	HTMLButtonAttributes;

type ThumbProps = HTMLSpanAttributes;

export type {
	Props,
	ThumbProps,
	//
	Props as SwitchProps,
	ThumbProps as SwitchThumbProps
};
