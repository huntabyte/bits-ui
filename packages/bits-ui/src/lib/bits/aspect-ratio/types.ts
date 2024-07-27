import type { DOMEl, HTMLDivAttributes } from "$lib/internal/index.js";

export type AspectRatioPropsWithoutHTML = Expand<
	{
		ratio?: number | undefined;
	} & DOMEl
>;

export type AspectRatioProps = AspectRatioPropsWithoutHTML & HTMLDivAttributes;
