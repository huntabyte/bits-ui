import { type CreateTooltipProps, createTooltip } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { getPositioningUpdater } from "../floating/helpers.js";
import type { FloatingConfig } from "../floating/floating-config.js";
import type { FloatingProps } from "../floating/_types.js";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

function getTooltipData() {
	const NAME = "tooltip" as const;
	const PARTS = ["arrow", "content", "trigger"] as const;
	return {
		NAME,
		PARTS,
	};
}

export function setCtx(props: CreateTooltipProps) {
	const { NAME, PARTS } = getTooltipData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const tooltip = {
		...createTooltip({
			positioning: {
				placement: "top",
				gutter: 0,
			},
			openDelay: 700,
			...removeUndefined(props),
			forceVisible: true,
		}),
		getAttrs,
	};
	setContext(NAME, tooltip);
	return {
		...tooltip,
		updateOption: getOptionUpdater(tooltip.options),
	};
}

export function getCtx() {
	const { NAME } = getTooltipData();
	return getContext<GetReturn>(NAME);
}

export function setArrow(size = 8) {
	const tooltip = getCtx();
	tooltip.options.arrowSize.set(size);
	return tooltip;
}

export function updatePositioning(props: FloatingProps) {
	const defaultPlacement = {
		side: "top",
		align: "center",
		sideOffset: 1,
	} satisfies FloatingProps;
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning },
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater({ ...withDefaults });
}
