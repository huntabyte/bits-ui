import type { HTMLDivAttributes } from "$lib/internal/index.js";
import type { Expand } from "$lib/internal/index.js";

export type AspectRatioPropsWithoutHTML = Expand<{
	ratio?: number;
	ref?: HTMLElement | null;
}>;

export type AspectRatioProps = AspectRatioPropsWithoutHTML & HTMLDivAttributes;
