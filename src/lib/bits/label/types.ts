import type { AsChild } from "$lib/internal/types.js";
import type { LabelComponentEvents } from "@melt-ui/svelte";
import type { HTMLLabelAttributes } from "svelte/elements";

type Props = AsChild & HTMLLabelAttributes;
type Events = LabelComponentEvents["root"];

export type {
	Props,
	//
	Props as LabelProps,
	//
	Events,
	//
	Events as LabelEvents
};
