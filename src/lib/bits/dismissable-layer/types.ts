import type { HTMLAttributes } from "svelte/elements";
import type { FocusOutsideEvent, PointerDownOutsideEvent } from "./utils.svelte";

export type DismissibleLayerProps = {
	/**
	 * When `true`, hover/focus/click interactions will be disabled on elements
	 * outside the `DismissableLayer`. Users will need to click twice on outside
	 * elements to interact with them: once to close the `DismissableLayer` and
	 * again to trigger the element.
	 */
	disableOutsidePointerEvents?: boolean;
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented with `event.preventDefault()`.
	 */
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	/**
	 * Event handler called when the escape key is down.
	 * Can be prevented with `event.preventDefault()`.
	 */
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
	/**
	 * Event handler called when focus moves outside.
	 * Can be prevented with `event.preventDefault()`.
	 */
	onFocusOutside?: (event: FocusOutsideEvent) => void;
	/**
	 * Event handler called when an interaction happens outside the `DismissableLayer`.
	 * Specifically, when a `pointerdown` event happens outside or focus moves outside.
	 * Can be prevented with `event.preventDefault()`.
	 */
	onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void;
	/**
	 * Event handler called when the `DismissableLayer` should be dismissed.
	 */
	onDismiss?: () => void;
} & PrimitiveAttributes;

interface PrimitiveAttributes extends HTMLAttributes<HTMLElement> {}
