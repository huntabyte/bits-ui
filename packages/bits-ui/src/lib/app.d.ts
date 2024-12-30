import type { ReadableBox } from "svelte-toolbelt";
import type { DismissibleLayerState } from "./bits/utilities/dismissible-layer/use-dismissable-layer.svelte.ts";
import type { InteractOutsideBehaviorType } from "./bits/utilities/dismissible-layer/types.ts";
import type { EscapeLayerState } from "./bits/utilities/escape-layer/use-escape-layer.svelte.ts";
import type { EscapeBehaviorType } from "./bits/utilities/escape-layer/types.ts";
import type { TextSelectionLayerState } from "./bits/utilities/text-selection-layer/use-text-selection-layer.svelte.ts";

declare global {
	// eslint-disable-next-line vars-on-top, no-var
	var bitsDismissableLayers: Map<DismissibleLayerState, ReadableBox<InteractOutsideBehaviorType>>;
	// eslint-disable-next-line vars-on-top, no-var
	var bitsEscapeLayers: Map<EscapeLayerState, ReadableBox<EscapeBehaviorType>>;
	// eslint-disable-next-line vars-on-top, no-var
	var bitsTextSelectionLayers: Map<TextSelectionLayerState, ReadableBox<boolean>>;
	// eslint-disable-next-line vars-on-top, no-var
	var bitsIdCounter: { current: number };
}
