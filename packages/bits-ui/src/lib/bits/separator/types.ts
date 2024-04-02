import type { CreateSeparatorProps as MeltSeparatorProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, HTMLDivAttributes } from "$lib/internal/index.js";

export type SeparatorPropsWithoutHTML = Expand<MeltSeparatorProps & DOMElement>;

export type SeparatorProps = SeparatorPropsWithoutHTML & HTMLDivAttributes;
