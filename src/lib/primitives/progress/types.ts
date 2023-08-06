import type { Expand, HTMLDivAttributes, OmitValue } from "$internal/index.js";
import type { CreateProgressProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitValue<CreateProgressProps> & {
		value?: CreateProgressProps["defaultValue"];
	}
> &
	HTMLDivAttributes;

type IndicatorProps = HTMLDivAttributes;

export type {
	Props,
	IndicatorProps,
	//
	Props as ProgressProps,
	IndicatorProps as ProgressIndicatorProps
};
