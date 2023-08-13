import type { AsChild, Expand, HTMLDivAttributes } from "$internal/index.js";
import type { CreateSeparatorProps } from "@melt-ui/svelte";

type Props = Expand<CreateSeparatorProps> & AsChild & HTMLDivAttributes;

export type {
	Props,
	//
	Props as SeparatorProps
};
