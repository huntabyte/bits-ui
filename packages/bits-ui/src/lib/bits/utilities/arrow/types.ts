import type { WithChild } from "$lib/internal/types.js";
import type { PrimitiveSpanAttributes } from "$lib/shared/attributes.js";

export type ArrowPropsWithoutHTML = WithChild<{
	/**
	 * The width of the arrow in pixels.
	 *
	 * @defaultValue 10
	 */
	width?: number;

	/**
	 * The height of the arrow in pixels.
	 *
	 * @defaultValue 5
	 */
	height?: number;
}>;

export type ArrowProps = ArrowPropsWithoutHTML & PrimitiveSpanAttributes;
