import type { HTMLDivAttributes } from "$lib/internal/index.js";

type Props = {
	ratio: number;
} & HTMLDivAttributes;

export type {
	Props,
	//
	Props as AspectRatioProps
};
