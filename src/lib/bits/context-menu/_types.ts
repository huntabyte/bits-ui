import type { AsChild, Transition, TransitionProps } from "$lib/internal/index.js";

export type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		/**
		 * An offset in pixels from the "start" or "end" alignment options.
		 */
		alignOffset?: number;

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
