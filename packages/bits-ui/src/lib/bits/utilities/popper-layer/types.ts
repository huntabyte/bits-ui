import type { Snippet } from "svelte";
import type { EscapeLayerProps } from "../escape-layer/types.js";
import type { DismissableLayerProps } from "../dismissable-layer/types.js";
import type { FloatingLayerContentProps } from "../floating-layer/types.js";
import type { PreventTextSelectionOverflowLayerProps } from "../prevent-text-selection-overflow-layer/types.js";
import type { PresenceLayerProps } from "../presence-layer/types.js";

export type PopperLayerProps = EscapeLayerProps &
	DismissableLayerProps &
	FloatingLayerContentProps &
	PresenceLayerProps &
	PreventTextSelectionOverflowLayerProps & {
		popper: Snippet<[{ props: Record<string, unknown> }]>;
	};
