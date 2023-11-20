import {
	createTooltip,
	type Tooltip as TooltipReturn,
	type CreateTooltipProps
} from "@melt-ui/svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getContext, setContext } from "svelte";
import { getPositioningUpdater, type PositioningProps } from "../floating/helpers";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config";

const NAME = "tooltip";
const PARTS = ["arrow", "content", "trigger"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = TooltipReturn;

export function setCtx(props: CreateTooltipProps) {
	const tooltip = createTooltip({
		positioning: {
			placement: "top"
		},
		openDelay: 700,
		...removeUndefined(props)
	});
	setContext(NAME, tooltip);
	return {
		...tooltip,
		updateOption: getOptionUpdater(tooltip.options)
	};
}

export function getCtx(sideOffset = 0) {
	const tooltip = getContext<GetReturn>(NAME);

	const {
		options: { positioning }
	} = tooltip;
	positioning.update((prev) => ({ ...prev, gutter: sideOffset }));

	return tooltip;
}

export function setArrow(size = 8) {
	const tooltip = getCtx();
	tooltip.options.arrowSize.set(size);
	return tooltip;
}

const defaultPlacement = {
	side: "top",
	align: "center"
} satisfies PositioningProps;

export function updatePositioning(props: PositioningProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies PositioningProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
