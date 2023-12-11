import type { PrimitiveDivAttributes } from "$lib/internal";

export type AspectRatioProps = {
	ratio: number;
} & PrimitiveDivAttributes;

export type AspectRatioWithoutHTML = Omit<AspectRatioProps, keyof PrimitiveDivAttributes>;
