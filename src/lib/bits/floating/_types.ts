import type { AsChild, Transition, TransitionProps } from "$lib/internal/index.js";

export type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
>;

export type Boundary = "clippingAncestors" | Element | Array<Element> | Rect;

export type Rect = {
	x: number;
	y: number;
	width: number;
	height: number;
};

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		/**
		 * The preferred side of the anchor to render against when open.
		 * Will be reversed when collisions occur.
		 */
		side?: "top" | "right" | "bottom" | "left";

		/**
		 * The preferred alignment of the anchor to render against when open.
		 * This may change when collisions occur.
		 */
		align?: "start" | "center" | "end";

		/**
		 * An offset in pixels from the "start" or "end" alignment options.
		 */
		alignOffset?: number;

		/**
		 * The distance in pixels from the anchor to the floating element.
		 */
		sideOffset?: number;

		/**
		 * Whether the content should be the same width as the trigger.
		 */
		sameWidth?: boolean;

		/**
		 * When `true`, overrides the `side` and `align` options to prevent collisions
		 * with the boundary edges.
		 *
		 * @defaultValue `true`
		 */
		avoidCollisions?: boolean;

		/**
		 * The amount in pixels of virtual padding around the viewport edges to check
		 * for overflow which will cause a collision.
		 */
		collisionPadding?: number;

		/**
		 * A boundary element or array of elements to check for collisions against.
		 */
		collisionBoundary?: Boundary;

		/**
		 * Whether the floating element should be constrained to the viewport.
		 *
		 * @defaultValue `false`
		 */
		fitViewport?: boolean;
	} & TransitionProps<T, In, Out> &
		AsChild
>;
