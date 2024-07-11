import type { Snippet } from "svelte";
import type { EscapeLayerProps } from "../utilities/escape-layer/types.js";
import type { DismissableLayerProps } from "../utilities/dismissable-layer/types.js";
import type { PresenceLayerProps } from "../utilities/presence-layer/types.js";
import type { FocusScopeProps } from "../utilities/focus-scope/types.js";
import type { TextSelectionLayerProps } from "../utilities/text-selection-layer/types.js";
import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
	WithChild,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { PortalProps } from "$lib/bits/utilities/portal/index.js";
import type { EventCallback } from "$lib/internal/events.js";

export type DialogRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the dialog.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;
}>;

export type DialogRootProps = DialogRootPropsWithoutHTML;

export type DialogContentPropsWithoutHTML = WithChild<
	EscapeLayerProps &
		DismissableLayerProps &
		PresenceLayerProps &
		FocusScopeProps &
		TextSelectionLayerProps & {
			preventScroll?: boolean;
		}
>;

export type DialogContentProps = DialogContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, DialogContentPropsWithoutHTML>;

export type DialogOverlayPropsWithoutHTML = WithChild<PresenceLayerProps>;
export type DialogOverlayProps = DialogOverlayPropsWithoutHTML &
	Without<PrimitiveDivAttributes, DialogOverlayPropsWithoutHTML>;

export type DialogPortalPropsWithoutHTML = PortalProps;
export type DialogPortalProps = DialogPortalPropsWithoutHTML;

export type DialogTriggerPropsWithoutHTML = WithChild;

export type DialogTriggerProps = DialogTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, DialogTriggerPropsWithoutHTML>;

export type DialogTitlePropsWithoutHTML = WithChild<{
	/**
	 * The heading level of the dialog title.
	 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type DialogTitleProps = DialogTitlePropsWithoutHTML &
	Without<PrimitiveDivAttributes, DialogTitlePropsWithoutHTML>;

export type DialogClosePropsWithoutHTML = DialogTriggerPropsWithoutHTML;
export type DialogCloseProps = DialogTriggerProps;

export type DialogDescriptionPropsWithoutHTML = WithChild;
export type DialogDescriptionProps = DialogDescriptionPropsWithoutHTML &
	Without<PrimitiveDivAttributes, DialogDescriptionPropsWithoutHTML>;
