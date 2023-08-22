import type { AsChild, Expand, HTMLDivAttributes, OmitValue, OnChangeFn } from "$internal/index.js";
import type { CreateProgressProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitValue<CreateProgressProps> & {
		value?: CreateProgressProps["defaultValue"];
		onValueChange?: OnChangeFn<CreateProgressProps["defaultValue"]>;
	} & AsChild
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
