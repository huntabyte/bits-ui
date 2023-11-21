import {
	createPopover,
	type CreatePopoverProps,
	type Popover as PopoverReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getPositioningUpdater, type PositioningProps } from "../floating/helpers";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config";

const NAME = "popover";
const PARTS = ["arrow", "close", "content", "trigger"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

type GetReturn = PopoverReturn;

export function setCtx(props: CreatePopoverProps) {
	const popover = createPopover({
		...removeUndefined(props),
		forceVisible: true
	});
	setContext(NAME, popover);
	return {
		...popover,
		updateOption: getOptionUpdater(popover.options)
	};
}

export function getCtx() {
	return getContext<GetReturn>(NAME);
}

export function setArrow(size = 8) {
	const popover = getCtx();
	popover.options.arrowSize.set(size);
	return popover;
}

const defaultPlacement = {
	side: "bottom",
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
