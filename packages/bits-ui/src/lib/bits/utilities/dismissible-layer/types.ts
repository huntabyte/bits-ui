import type { Snippet } from "svelte";

export type InteractOutsideEvent = PointerEvent | MouseEvent | TouchEvent;
export type InteractOutsideEventHandler = (e: InteractOutsideEvent) => void;

export type InteractOutsideBehaviorType =
	| "close"
	| "defer-otherwise-close"
	| "defer-otherwise-ignore"
	| "ignore";

export type DismissibleLayerProps = {
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
	interactOutsideBehavior?: InteractOutsideBehaviorType;

	/**
	 * Callback fired when focus leaves the dismissible layer.
	 */
	onFocusOutside?: (event: FocusEvent) => void;
};

export type DismissibleLayerImplProps = {
	/**
	 * Whether the layer is enabled.
	 */
	enabled: boolean;

	/**
	 * ID of the layer.
	 */
	id: string;

	/**
	 * Provide a custom event validator function to determine if the event should be
	 * considered a dismissal event. This was added to handle the case where a user
	 * has one context menu open and right clicks on another context menu. We normally ignore
	 * right clicks for "close" events, but in this case we want to close the context menu when
	 * another is open.
	 */
	isValidEvent?: (e: PointerEvent | MouseEvent | TouchEvent, node: HTMLElement) => boolean;

	children?: Snippet<[{ props: Record<string, unknown> }]>;
} & DismissibleLayerProps;

export type InteractOutsideInterceptEventType =
	| "pointerdown"
	| "pointerup"
	| "mousedown"
	| "mouseup"
	| "touchstart"
	| "touchend"
	| "click";
