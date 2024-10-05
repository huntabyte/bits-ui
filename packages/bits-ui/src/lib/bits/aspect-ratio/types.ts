import type { WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type AspectRatioRootPropsWithoutHTML = WithChild<{
	/**
	 * The aspect ratio of the image.
	 *
	 * @defaultValue 1
	 */
	ratio?: number;
}>;

export type AspectRatioRootProps = AspectRatioRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, AspectRatioRootPropsWithoutHTML>;
