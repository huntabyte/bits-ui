import type { Snippet } from "svelte";
import type { EscapeLayerImplProps, EscapeLayerProps } from "../escape-layer/types.js";
import type {
	DismissableLayerImplProps,
	DismissableLayerProps,
} from "../dismissable-layer/types.js";
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
	Omit<DismissableLayerProps, "onInteractOutsideStart"> &
	FloatingLayerContentProps &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	ScrollLockProps;

export type PopperLayerStaticProps = EscapeLayerProps &
	Omit<DismissableLayerProps, "onInteractOutsideStart"> &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps &
	ScrollLockProps & {
		content?: Snippet<[{ props: Record<string, unknown> }]>;
		dir?: Direction;
	};

export type PopperLayerImplProps = Omit<
	EscapeLayerImplProps &
		DismissableLayerImplProps &
		FloatingLayerContentImplProps &
		Omit<PresenceLayerImplProps, "presence"> &
		TextSelectionLayerImplProps &
		FocusScopeImplProps & {
			popper: Snippet<[{ props: Record<string, unknown> }]>;
			isStatic?: boolean;
		},
	"enabled"
>;
