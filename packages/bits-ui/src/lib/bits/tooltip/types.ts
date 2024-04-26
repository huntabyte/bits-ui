import type { Snippet } from "svelte";
import type { FloatingLayerContentProps } from "../utilities/floating-layer/types.js";
import type { OnChangeFn, WithAsChild } from "$lib/internal/types.js";

export type TooltipRootPropsWithoutHTML = {
	/**
	 * The open state of the tooltip.
	 *
	 * @defaultValue false
	 */
	open?: boolean;

	/**
	 * A callback that will be called when the tooltip is opened or closed.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The delay in milliseconds before the tooltip opens.
	 *
	 * @defaultValue 700
	 */
	delayDuration?: number;

	/**
	 * Prevents tooltip from remaining open when hovering over the content.
	 *
	 * @defaultValue false
	 */
	disableHoverableContent?: boolean;

	/**
	 * When `true`, the tooltip will not close when you click on the trigger.
	 *
	 * @defaultValue false
	 */
	disableCloseOnTriggerClick?: boolean;

	/**
	 * When `true`, the tooltip will be disabled and will not open.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Prevent the tooltip from opening if the focus did not come using
	 * the keyboard.
	 *
	 * @defaultValue false
	 */
	ignoreNonKeyboardFocus?: boolean;

	children?: Snippet;
};

export type TooltipRootProps = TooltipRootPropsWithoutHTML;

export type TooltipContentPropsWithoutHTML = WithAsChild<
	Pick<
		FloatingLayerContentProps,
		| "side"
		| "sideOffset"
		| "align"
		| "alignOffset"
		| "avoidCollisions"
		| "collisionBoundary"
		| "collisionPadding"
		| "arrowPadding"
		| "sticky"
		| "hideWhenDetached"
	>
>;
