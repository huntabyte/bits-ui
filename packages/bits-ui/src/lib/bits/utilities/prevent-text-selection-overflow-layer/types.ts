import type { Snippet } from "svelte";

export type PointerHandler = (e: PointerEvent) => void;

export type PreventTextSelectionOverflowLayerProps = {
	/**
	 * DOM ID of the node.
	 */
	id: string;

	children?: Snippet;

	/**
	 * Callback fired when pointerdown event triggers. Call `preventDefault()`
	 * to disable the prevention of text-selection overflow.
	 */
	onPointerDown?: PointerHandler;

	/**
	 * Callback fired when pointerup event triggers.
	 */
	onPointerUp?: PointerHandler;

	/**
	 * Passing `enabled: true` will prevent the overflow of text selection
	 * outside the element, provided the element is the top layer.
	 * @defaultValue `true`
	 */
	enabled?: boolean;

	/**
	 * Whether the layer is enabled. Currently, we determine this with the
	 * `presence` returned from the `presence` layer.
	 */
	present: boolean;
};
