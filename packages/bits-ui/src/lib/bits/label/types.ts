import type { PrimitiveLabelAttributes, WithAsChild } from "$lib/internal/types.js";
import type { EventCallback } from "$lib/internal/events.js";

export type LabelRootPropsWithoutHTML = WithAsChild<{
	for: string;
}> & {
	onmousedown?: EventCallback<MouseEvent>;
};

export type LabelRootProps = LabelRootPropsWithoutHTML &
	Omit<PrimitiveLabelAttributes, "onmousedown" | "for">;
