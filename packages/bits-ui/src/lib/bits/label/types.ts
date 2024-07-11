import type { PrimitiveLabelAttributes, WithChild, Without } from "$lib/internal/types.js";

export type LabelRootPropsWithoutHTML = WithChild<{
	for: string;
}>;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<PrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;
