export type FloatingConfig = {
	/**
	 * The initial placement of the floating element.
	 * @default `"top"`
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	placement?:
		| "top"
		| "top-start"
		| "top-end"
		| "right"
		| "right-start"
		| "right-end"
		| "bottom"
		| "bottom-start"
		| "bottom-end"
		| "left"
		| "left-start"
		| "left-end";

	/**
	 * The strategy to use for positioning.
	 * @default `"absolute"`
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	strategy?: "absolute" | "fixed" | undefined;

	/**
	 * The offset of the floating element.
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	offset?: { mainAxis?: number; crossAxis?: number } | undefined;

	/**
	 * The main axis offset or gap between the reference and floating elements.
	 * @default `5`
	 *
	 * @see https://floating-ui.com/docs/offset#options
	 */
	gutter?: number | undefined;

	/**
	 * The virtual padding around the viewport edges to check for overflow.
	 * @default `8`
	 *
	 * @see https://floating-ui.com/docs/detectOverflow#padding
	 */
	overflowPadding?: number | undefined;

	/**
	 * Whether to flip the placement.
	 * @default `true`
	 *
	 * @see https://floating-ui.com/docs/flip
	 */
	flip?: boolean | undefined;

	/**
	 * Whether the floating element can overlap the reference element.
	 * @default `false`
	 *
	 * @see https://floating-ui.com/docs/shift#options
	 */
	overlap?: boolean | undefined;

	/**
	 * Whether to make the floating element same width as the reference element.
	 * @default `false`
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	sameWidth?: boolean | undefined;

	/**
	 * Whether the floating element should fit the viewport.
	 * @default `false`
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	fitViewport?: boolean | undefined;

	/**
	 * The overflow boundary of the reference element.
	 *
	 * @see https://floating-ui.com/docs/detectoverflow#boundary
	 */
	boundary?: Boundary | undefined;
};

type Boundary = "clippingAncestors" | Element | Array<Element> | Rect;

type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};
