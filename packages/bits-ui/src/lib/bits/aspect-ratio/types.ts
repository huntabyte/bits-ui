import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";

export type AspectRatioPropsWithoutHTML = Expand<
	{
		ratio?: number;
	} & {
		ref?: HTMLElement | null;
	}
>;

export type AspectRatioProps = AspectRatioPropsWithoutHTML & HTMLDivAttributes;
