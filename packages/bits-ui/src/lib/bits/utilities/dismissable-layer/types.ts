import type { Snippet } from "svelte";

export type InteractOutsideEvent = PointerEvent | MouseEvent | TouchEvent;
export type InteractOutsideEventHandler = (e: InteractOutsideEvent) => void;

export type InteractOutsideBehaviorType =
	| "close"
	| "defer-otherwise-close"
	| "defer-otherwise-ignore"
	| "ignore";

export type DismissableLayerProps = {
	/**
	 * DOM ID of the node.
	 */
	id: string;

	children?: Snippet;

	/**
	 * Callback fired when an outside interaction event completes,
	 * which is either a `pointerup`, `mouseup`, or `touchend`
	 * event, depending on the user's input device.
	 */
	onInteractOutside?: InteractOutsideEventHandler;

	/**
	 * Callback fired when an outside interaction event starts,
	 * which is either a `pointerdown`, `mousedown`, or `touchstart`
	 * event, depending on the user's input device.
	 *
	 * This callback is useful when you want to know when the user
	 * begins an outside interaction, but before the interaction
	 * completes.
	 */
	onInteractOutsideStart?: InteractOutsideEventHandler;

	/**
	 * Interact outside behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an outside interaction.
	 *
	 * @defaultValue `close`
	 */
	behaviorType?: InteractOutsideBehaviorType;

	/**
	 * Whether the layer is active. Currently, we determine this with the
	 * `presence` returned from the `presence` layer.
	 */
	present: boolean;
};

export type InteractOutsideInterceptEventType =
	| "pointerdown"
	| "pointerup"
	| "mousedown"
	| "mouseup"
	| "touchstart"
	| "touchend"
	| "click";
