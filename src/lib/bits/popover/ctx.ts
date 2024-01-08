import { createPopover, type CreatePopoverProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { getPositioningUpdater } from "$lib/bits/floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "$lib/bits/floating/floating-config.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

export function getPopoverData() {
	const NAME = "popover" as const;
	const PARTS = ["arrow", "close", "content", "trigger"] as const;

	return {
		NAME,
		PARTS
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreatePopoverProps) {
	const { NAME, PARTS } = getPopoverData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const popover = {
		...createPopover({
			...removeUndefined(props),
			forceVisible: true
		}),
		getAttrs
	};
	setContext(NAME, popover);
	return {
		...popover,
		updateOption: getOptionUpdater(popover.options)
	};
}

export function getCtx() {
	const { NAME } = getPopoverData();
	return getContext<GetReturn>(NAME);
}

export function setArrow(size = 8) {
	const popover = getCtx();
	popover.options.arrowSize.set(size);
	return popover;
}

export function updatePositioning(props: FloatingProps) {
	const defaultPlacement = {
		side: "bottom",
		align: "center"
	} satisfies FloatingProps;

	const withDefaults = { ...defaultPlacement, ...props } satisfies FloatingProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
}
