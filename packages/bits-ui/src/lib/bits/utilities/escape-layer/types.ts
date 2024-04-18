import type { Snippet } from "svelte";

export type EscapeBehaviorType =
	| "close"
	| "defer-otherwise-close"
	| "defer-otherwise-ignore"
	| "ignore";

export type EscapeLayerProps = {
	children?: Snippet;

	/**
	 * Callback fired when escape is pressed.
	 */
	onEscape?: (e: KeyboardEvent) => void;

	/**
	 * Escape behavior type.
	 * `close`: Closes the element immediately.
	 * `defer-otherwise-close`: Delegates the action to the parent element. If no parent is found, it closes the element.
	 * `defer-otherwise-ignore`: Delegates the action to the parent element. If no parent is found, nothing is done.
	 * `ignore`: Prevents the element from closing and also blocks the parent element from closing in response to an escape key press.
	 *
	 * @defaultValue `close`
	 */
	behaviorType?: EscapeBehaviorType;
};
