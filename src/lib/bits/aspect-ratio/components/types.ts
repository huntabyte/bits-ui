import type { HTMLDivAttributes } from "$lib/internal"

export type AspectRatioProps = {
	ratio: number;
} & HTMLDivAttributes;

export type AspectRatioWithoutHTML = Omit<AspectRatioProps, keyof HTMLDivAttributes>;