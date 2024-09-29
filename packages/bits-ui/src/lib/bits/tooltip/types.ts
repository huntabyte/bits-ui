import type { FloatingLayerContentProps } from "../utilities/floating-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { OnChangeFn, WithChild, WithChildren, Without } from "$lib/internal/types.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";
import type { PortalProps } from "$lib/bits/utilities/portal/types.js";

export type TooltipProviderPropsWithoutHTML = WithChildren<{
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
}>;

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

	/**
	 * Whether or not the open state is controlled or not. If `true`, the component will not update
	 * the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `open` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;
}>;

export type TooltipRootProps = TooltipRootPropsWithoutHTML;

export type TooltipContentSnippetProps = {
	/**
	 * Whether the content is open or closed. Used alongside the `forceMount` prop to
	 * conditionally render the content using Svelte transitions.
	 */
	open: boolean;
};

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
		| "arrowOffset"
	> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the tooltip will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	TooltipContentSnippetProps
>;

export type TooltipContentProps = TooltipContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TooltipContentPropsWithoutHTML>;

export type TooltipContentStaticPropsWithoutHTML = WithChild<
	Pick<FloatingLayerContentProps, "dir"> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the tooltip will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	TooltipContentSnippetProps
>;

export type TooltipContentStaticProps = TooltipContentStaticPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TooltipContentStaticPropsWithoutHTML>;

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
	disabled?: boolean | null | undefined;
}>;

export type TooltipTriggerProps = TooltipTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, TooltipTriggerPropsWithoutHTML>;
