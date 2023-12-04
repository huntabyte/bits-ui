import {
	createPopover,
	type CreatePopoverProps,
	type Popover as PopoverReturn
} from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getPositioningUpdater } from "$lib/bits/floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "$lib/bits/floating/floating-config.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

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
} satisfies FloatingProps;

export function updatePositioning(props: FloatingProps) {
	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
