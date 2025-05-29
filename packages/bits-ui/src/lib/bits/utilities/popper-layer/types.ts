import type { Snippet } from "svelte";
import type { EscapeLayerImplProps, EscapeLayerProps } from "../escape-layer/types.js";
import type {
	DismissibleLayerImplProps,
	DismissibleLayerProps,
} from "../dismissible-layer/types.js";
import type {
	FloatingLayerContentImplProps,
	FloatingLayerContentProps,
} from "../floating-layer/types.js";
import type {
	TextSelectionLayerImplProps,
	TextSelectionLayerProps,
} from "../text-selection-layer/types.js";
import type { PresenceLayerImplProps, PresenceLayerProps } from "../presence-layer/types.js";
import type { FocusScopeImplProps, FocusScopeProps } from "../focus-scope/types.js";
import type { ScrollLockProps } from "../scroll-lock/index.js";
import type { Direction } from "$lib/shared/index.js";

export type PopperLayerProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
	FloatingLayerContentProps &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	Omit<ScrollLockProps, "restoreScrollDelay">;

export type PopperLayerStaticProps = EscapeLayerProps &
	Omit<DismissibleLayerProps, "onInteractOutsideStart"> &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	Omit<ScrollLockProps, "restoreScrollDelay"> & {
		content?: Snippet<[{ props: Record<string, unknown> }]>;
		dir?: Direction;
	};

export type PopperLayerImplProps = Omit<
	EscapeLayerImplProps &
		DismissibleLayerImplProps &
		FloatingLayerContentImplProps &
		Omit<PresenceLayerImplProps, "presence"> &
		TextSelectionLayerImplProps &
		FocusScopeImplProps & {
			popper: Snippet<
				[{ props: Record<string, unknown>; wrapperProps: Record<string, unknown> }]
			>;
			isStatic?: boolean;
			/**
			 * Tooltips are special in that they are commonly composed
			 * with other floating components, where the same trigger is
			 * used for both the tooltip and the popover.
			 *
			 * For situations like this, we need to use a different context
			 * symbol so that conflicts don't occur.
			 */
			tooltip?: boolean;
		},
	"enabled"
>;
