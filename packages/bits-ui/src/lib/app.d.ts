import type { ReadableBox } from "svelte-toolbelt";
import type { DismissibleLayerState } from "./bits/utilities/dismissible-layer/useDismissibleLayer.svelte.ts";
import type { InteractOutsideBehaviorType } from "./bits/utilities/dismissible-layer/types.ts";
import type { EscapeLayerState } from "./bits/utilities/escape-layer/useEscapeLayer.svelte.ts";
import type { EscapeBehaviorType } from "./bits/utilities/escape-layer/types.ts";
import type { TextSelectionLayerState } from "./bits/utilities/text-selection-layer/useTextSelectionLayer.svelte.ts";

declare global {
	// eslint-disable-next-line vars-on-top, no-var
	var bitsDismissableLayers: Map<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>;
	// eslint-disable-next-line vars-on-top, no-var
	var bitsEscapeLayers: Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>;
	// eslint-disable-next-line vars-on-top, no-var
	var bitsTextSelectionLayers: Map<TextSelectionLayerState, ReadableBox<boolean>>;
}
