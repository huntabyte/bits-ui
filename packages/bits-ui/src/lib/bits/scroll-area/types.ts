import type { PrimitiveDivAttributes } from "$lib/internal/types.js";
import type { Direction, WithChild, Without } from "$lib/shared/index.js";

export type ScrollAreaType = "hover" | "scroll" | "auto" | "always";

export type ScrollAreaRootPropsWithoutHTML = WithChild<{
	type?: ScrollAreaType;
	dir?: Direction;
	scrollHideDelay?: number;
}>;

export type ScrollAreaRootProps = ScrollAreaRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, ScrollAreaRootPropsWithoutHTML>;
