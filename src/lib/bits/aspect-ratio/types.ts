import type { HTMLDivAttributes } from "$internal/index.js";

type Props = {
	ratio: number;
} & HTMLDivAttributes;

export type {
	Props,
	//
	Props as AspectRatioProps
};
