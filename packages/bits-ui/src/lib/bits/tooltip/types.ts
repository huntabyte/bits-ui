import type { Snippet } from "svelte";
import type { FloatingLayerContentProps } from "../utilities/floating-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { DismissableLayerProps } from "../utilities/dismissable-layer/types.js";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
	WithChild,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { PortalProps } from "$lib/bits/utilities/portal/types.js";
import type { EventCallback } from "$lib/internal/events.js";

export type TooltipProviderPropsWithoutHTML = {
	/**
	 * The delay in milliseconds before the tooltip opens.
	 *
	 * @defaultValue 700
	 */
	delayDuration?: number;

	/**
	 * How much time a user has to enter another trigger without
	 * incurring a delay again.
	 * @defaultValue 300
	 */
	skipDelayDuration?: number;

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

export type TooltipProviderProps = TooltipProviderPropsWithoutHTML;

export type TooltipRootPropsWithoutHTML = WithChildren<{
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
}>;

export type TooltipRootProps = TooltipRootPropsWithoutHTML;

export type TooltipContentPropsWithoutHTML = WithChild<
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
		| "dir"
	> &
		DismissableLayerProps &
		EscapeLayerProps & {
			/**
			 * When `true`, the tooltip will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		}
>;

export type TooltipContentProps = TooltipContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TooltipContentPropsWithoutHTML>;

export type TooltipArrowPropsWithoutHTML = ArrowPropsWithoutHTML;
export type TooltipArrowProps = ArrowProps;

export type TooltipPortalPropsWithoutHTML = PortalProps;
export type TooltipPortalProps = PortalProps;

export type TooltipTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the tooltip trigger is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
}>;

export type TooltipTriggerProps = TooltipTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, TooltipTriggerPropsWithoutHTML>;
