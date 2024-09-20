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
import type { Direction } from "$lib/shared/index.js";

export type PopperLayerProps = EscapeLayerProps &
	DismissableLayerProps &
	FloatingLayerContentProps &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps;

export type PopperLayerStaticProps = EscapeLayerProps &
	DismissableLayerProps &
	PresenceLayerProps &
	TextSelectionLayerProps &
	FocusScopeProps & {
		content?: Snippet<[{ props: Record<string, unknown> }]>;
		dir?: Direction;
		preventScroll?: boolean;
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
