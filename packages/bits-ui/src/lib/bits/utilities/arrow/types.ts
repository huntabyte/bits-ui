import type { PrimitiveSpanAttributes, WithAsChild } from "$lib/internal/types.js";

export type ArrowPropsWithoutHTML = WithAsChild<{
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
