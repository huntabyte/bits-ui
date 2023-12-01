import { createDateRangePicker, type CreateDateRangePickerProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import type { Writable } from "svelte/store";
import { removeUndefined, getOptionUpdater } from "$lib/internal/index.js";
import { getAttrs as getCalendarAttrs } from "$lib/bits/calendar/ctx.js";
import { getAttrs as getFieldAttrs } from "$lib/bits/date-field/ctx.js";
import { getAttrs as getPopoverAttrs } from "$lib/bits/popover/ctx.js";
import type { FloatingConfig } from "$lib/bits/floating/floating-config.js";
import { getPositioningUpdater, type PositioningProps } from "$lib/bits/floating/helpers.js";

const NAME = "date-range-picker";

export { getCalendarAttrs, getFieldAttrs, getPopoverAttrs };

export function setCtx(props: CreateDateRangePickerProps) {
	const dateRangePicker = createDateRangePicker(removeUndefined(props));
	const updateOption = getOptionUpdater(dateRangePicker.options);
	setContext(NAME, { ...dateRangePicker, updateOption });

	return {
		...dateRangePicker,
		updateOption: getOptionUpdater(dateRangePicker.options)
	};
}

export function getCtx() {
	return getContext<ReturnType<typeof setCtx>>(NAME);
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
