import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { DismissibleLayerProps } from "../utilities/dismissible-layer/types.js";
import type { PresenceLayerProps } from "../utilities/presence-layer/types.js";
import type { FocusScopeProps } from "../utilities/focus-scope/types.js";
import type { TextSelectionLayerProps } from "../utilities/text-selection-layer/types.js";
import type { ScrollLockProps } from "../utilities/scroll-lock/index.js";
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
import type { PortalProps } from "$lib/bits/utilities/portal/index.js";
import type { DrawerTether as DrawerTetherImpl } from "./drawer.svelte.js";

export type DrawerTether<Payload = unknown> = DrawerTetherImpl<Payload>;
import type { Snippet } from "svelte";

export type DrawerSwipeDirection = "up" | "down" | "left" | "right";
export type DrawerSnapPoint = number | string;

export type DrawerRootSnippetProps<Payload = never> = {
	triggerId: string | null;
	payload: [Payload] extends [never] ? null : Payload | null;
};

export type DrawerRootPropsWithoutHTML<Payload = never> = {
	/**
	 * The open state of the drawer.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the drawer's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * A callback called when the drawer finishes opening/closing animations.
	 */
	onOpenChangeComplete?: OnChangeFn<boolean>;

	/**
	 * The swipe direction used to dismiss the drawer.
	 *
	 * @default "down"
	 */
	swipeDirection?: DrawerSwipeDirection;

	/**
	 * Snap points for the drawer. Numbers from `0` to `1` are treated as viewport fractions.
	 * Numbers larger than `1` are treated as pixels. Strings should use CSS length units.
	 */
	snapPoints?: DrawerSnapPoint[];

	/**
	 * The controlled active snap point.
	 */
	snapPoint?: DrawerSnapPoint | null | undefined;

	/**
	 * A callback fired when the active snap point changes.
	 */
	onSnapPointChange?: OnChangeFn<DrawerSnapPoint | null | undefined>;

	/**
	 * When `true`, the drawer should move through snap points sequentially.
	 *
	 * @default false
	 */
	snapToSequentialPoints?: boolean;

	/**
	 * A handle to associate this drawer with detached triggers.
	 */
	tether?: DrawerTether<Payload> | undefined;

	/**
	 * The id of the trigger currently associated with the drawer.
	 */
	triggerId?: string | null;
} & {
	children?: Snippet | Snippet<[DrawerRootSnippetProps<Payload>]>;
};

export type DrawerRootProps<Payload = never> = DrawerRootPropsWithoutHTML<Payload>;

export type DrawerTriggerPropsWithoutHTML<Payload = never> = WithChild<{
	/**
	 * Whether the trigger is disabled.
	 *
	 * @default false
	 */
	disabled?: boolean | null | undefined;

	/**
	 * Shared tether used to connect detached triggers and infer payload types.
	 */
	tether?: DrawerTether<Payload> | undefined;

	/**
	 * Payload for the trigger used by singleton drawer root snippets.
	 */
	payload?: [Payload] extends [never] ? unknown : Payload;
}>;

export type DrawerTriggerProps<Payload = never> = DrawerTriggerPropsWithoutHTML<Payload> &
	Without<BitsPrimitiveButtonAttributes, DrawerTriggerPropsWithoutHTML<Payload>>;

export type DrawerBackdropSnippetProps = {
	open: boolean;
};

export type DrawerBackdropPropsWithoutHTML = WithChild<
	PresenceLayerProps,
	DrawerBackdropSnippetProps
>;

export type DrawerBackdropProps = DrawerBackdropPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerBackdropPropsWithoutHTML>;

export type DrawerViewportSnippetProps = {
	open: boolean;
};

export type DrawerViewportPropsWithoutHTML = WithChild<
	PresenceLayerProps,
	DrawerViewportSnippetProps
>;

export type DrawerViewportProps = DrawerViewportPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerViewportPropsWithoutHTML>;

export type DrawerPopupSnippetProps = {
	open: boolean;
};

export type DrawerPopupPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<
		EscapeLayerProps &
			Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
			PresenceLayerProps &
			FocusScopeProps &
			TextSelectionLayerProps &
			ScrollLockProps,
		"loop"
	>,
	DrawerPopupSnippetProps
>;

export type DrawerPopupProps = DrawerPopupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerPopupPropsWithoutHTML>;

export type DrawerContentPropsWithoutHTML = WithChild;
export type DrawerContentProps = DrawerContentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerContentPropsWithoutHTML>;

export type DrawerPortalPropsWithoutHTML = PortalProps;
export type DrawerPortalProps = DrawerPortalPropsWithoutHTML;

export type DrawerTitlePropsWithoutHTML = WithChild<{
	/**
	 * The heading level of the drawer title.
	 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type DrawerTitleProps = DrawerTitlePropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerTitlePropsWithoutHTML>;

export type DrawerDescriptionPropsWithoutHTML = WithChild;
export type DrawerDescriptionProps = DrawerDescriptionPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerDescriptionPropsWithoutHTML>;

export type DrawerClosePropsWithoutHTML = DrawerTriggerPropsWithoutHTML;
export type DrawerCloseProps = DrawerTriggerProps;

export type DrawerSwipeAreaPropsWithoutHTML = WithChild<{
	disabled?: boolean;
	swipeDirection?: DrawerSwipeDirection;
}>;

export type DrawerSwipeAreaProps = DrawerSwipeAreaPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerSwipeAreaPropsWithoutHTML>;

export type DrawerProviderPropsWithoutHTML = WithChildren;

export type DrawerProviderProps = DrawerProviderPropsWithoutHTML;

export type DrawerIndentPropsWithoutHTML = WithChild;
export type DrawerIndentProps = DrawerIndentPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerIndentPropsWithoutHTML>;

export type DrawerIndentBackgroundPropsWithoutHTML = WithChild;
export type DrawerIndentBackgroundProps = DrawerIndentBackgroundPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, DrawerIndentBackgroundPropsWithoutHTML>;
