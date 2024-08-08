import type { WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveLabelAttributes } from "$lib/shared/attributes.js";

export type LabelRootPropsWithoutHTML = WithChild;

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Without<PrimitiveLabelAttributes, LabelRootPropsWithoutHTML>;
