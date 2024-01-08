import type { DOMElement, Transition, TransitionProps } from "$lib/internal/index.js";

export type ArrowProps = Expand<
	{
		size?: number;
	} & DOMElement
>;

export type Boundary = "clippingAncestors" | Element | Array<Element> | Rect;

export type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type FloatingProps = {
	/**
	 * The preferred side of the anchor to render against when open.
	 * Will be reversed when collisions occur.
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	side?: "top" | "right" | "bottom" | "left";

	/**
	 * The preferred alignment of the anchor to render against when open.
	 * This may change when collisions occur.
	 *
	 * @see https://floating-ui.com/docs/computePosition#placement
	 */
	align?: "start" | "center" | "end";

	/**
	 * An offset in pixels from the "start" or "end" alignment options.
	 * @see https://floating-ui.com/docs/offset#options
	 */
	alignOffset?: number;

	/**
	 * The distance in pixels from the anchor to the floating element.
	 * @see https://floating-ui.com/docs/offset#options
	 */
	sideOffset?: number;

	/**
	 * Whether the content should be the same width as the trigger.
	 *
	 * @see https://floating-ui.com/docs/size
	 */
	sameWidth?: boolean;

	/**
	 * When `true`, overrides the `side` and `align` options to prevent collisions
	 * with the boundary edges.
	 *
	 * @default true
	 * @see https://floating-ui.com/docs/flip
	 */
	avoidCollisions?: boolean;

	/**
	 * The amount in pixels of virtual padding around the viewport edges to check
	 * for overflow which will cause a collision.
	 *
	 * @default 8
	 * @see https://floating-ui.com/docs/detectOverflow#padding
	 */
	collisionPadding?: number;

	/**
	 * A boundary element or array of elements to check for collisions against.
	 *
	 * @see https://floating-ui.com/docs/detectoverflow#boundary
	 */
	collisionBoundary?: Boundary;

	/**
	 * Whether the floating element should be constrained to the viewport.
	 *
	 * @default false
	 * @see https://floating-ui.com/docs/size
	 */
	fitViewport?: boolean;

	/**
	 * The positioning strategy to use for the floating element.
	 * @see https://floating-ui.com/docs/computeposition#strategy
	 */
	strategy?: "absolute" | "fixed";

	/**
	 * Whether the floating element can overlap the reference element.
	 * @default false
	 *
	 * @see https://floating-ui.com/docs/shift#options
	 */
	overlap?: boolean;
};

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<FloatingProps & TransitionProps<T, In, Out> & DOMElement>;
