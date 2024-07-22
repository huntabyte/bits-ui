import type { PrimitiveDivAttributes, WithChild, Without } from "$lib/internal/index.js";

export type AspectRatioPropsWithoutHTML = WithChild<{
	ratio?: number;
}>;

export type AspectRatioProps = AspectRatioPropsWithoutHTML &
	Without<PrimitiveDivAttributes, AspectRatioPropsWithoutHTML>;
