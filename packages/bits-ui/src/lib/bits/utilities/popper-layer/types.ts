import type { Snippet } from "svelte";
import type { EscapeLayerProps } from "../escape-layer/types.js";
import type { DismissableLayerProps } from "../dismissable-layer/types.js";
import type { FloatingLayerContentProps } from "../floating-layer/types.js";
import type { TextSelectionLayerProps } from "../text-selection-layer/types.js";
import type { PresenceLayerProps } from "../presence-layer/types.js";

export type PopperLayerProps = EscapeLayerProps &
	DismissableLayerProps &
	FloatingLayerContentProps &
	PresenceLayerProps &
	TextSelectionLayerProps & {
		popper: Snippet<[{ props: Record<string, unknown> }]>;
	};
