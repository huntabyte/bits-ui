import type { FloatingLayerContentProps } from "../utilities/floating-layer/types.js";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { Snippet } from "svelte";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";
import type { PortalProps } from "$lib/bits/utilities/portal/types.js";
import type { FloatingContentSnippetProps, StaticContentSnippetProps } from "$lib/shared/types.js";
import type { TooltipTether as TooltipTetherImpl } from "./tooltip.svelte.js";

export type TooltipTether<Payload = never> = TooltipTetherImpl<Payload>;

export type TooltipRootSnippetProps<Payload = never> = {
	open: boolean;
	triggerId: string | null;
	payload: [Payload] extends [never] ? null : Payload | null;
};

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

export type TooltipRootPropsWithoutHTML<Payload = never> = Omit<
	WithChildren<{
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
	 * A callback that will be called when the tooltip is opened or closed.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

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
	 * The active trigger id for controlled single tooltip mode.
	 */
	triggerId?: string | null;
	/**
	 * Shared tether used to connect detached triggers and infer payload types.
	 */
	tether?: TooltipTether<Payload> | undefined;
	}>,
	"children"
> & {
	children?: Snippet | Snippet<[TooltipRootSnippetProps<Payload>]>;
};

export type TooltipRootProps<Payload = never> = TooltipRootPropsWithoutHTML<Payload>;

export type TooltipContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<FloatingLayerContentProps, "content" | "preventScroll"> &
		Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
		EscapeLayerProps & {
			/**
			 * When `true`, the tooltip will be forced to mount in the DOM.
			 *
			 * Useful for more control over the transition behavior.
			 */
			forceMount?: boolean;
		},
	FloatingContentSnippetProps
>;

export type TooltipContentProps = TooltipContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TooltipContentPropsWithoutHTML>;

export type TooltipContentStaticPropsWithoutHTML = WithChildNoChildrenSnippetProps<
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
	StaticContentSnippetProps
>;

export type TooltipContentStaticProps = TooltipContentStaticPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, TooltipContentStaticPropsWithoutHTML>;

export type TooltipArrowPropsWithoutHTML = ArrowPropsWithoutHTML;
export type TooltipArrowProps = ArrowProps;

export type TooltipPortalPropsWithoutHTML = PortalProps;
export type TooltipPortalProps = PortalProps;

export type TooltipTriggerPropsWithoutHTML<Payload = never> = WithChild<{
	/**
	 * Whether the tooltip trigger is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
	/**
	 * Payload for the trigger used by singleton tooltip root snippets.
	 */
	payload?: [Payload] extends [never] ? unknown : Payload;
	/**
	 * Shared tether used to connect detached triggers and infer payload types.
	 */
	tether?: TooltipTether<Payload> | undefined;
}>;

export type TooltipTriggerProps<Payload = never> = TooltipTriggerPropsWithoutHTML<Payload> &
	Without<BitsPrimitiveButtonAttributes, TooltipTriggerPropsWithoutHTML<Payload>>;
