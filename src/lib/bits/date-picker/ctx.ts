import { createDatePicker, type CreateDatePickerProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater } from "$lib/internal/index.js";
import { getAttrs as getCalendarAttrs } from "$lib/bits/calendar/ctx.js";
import { getAttrs as getFieldAttrs } from "$lib/bits/date-field/ctx.js";
import { getAttrs as getPopoverAttrs } from "$lib/bits/popover/ctx.js";
import { getPositioningUpdater } from "$lib/bits/floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "$lib/bits/floating/floating-config.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

const NAME = "date-picker";

export { getCalendarAttrs, getFieldAttrs, getPopoverAttrs };

export function setCtx(props: CreateDatePickerProps) {
	const datePicker = createDatePicker(removeUndefined(props));
	const updateOption = getOptionUpdater(datePicker.options);
	setContext(NAME, { ...datePicker, updateOption });

	return {
		...datePicker,
		updateOption: getOptionUpdater(datePicker.options)
	};
}

export function getCtx() {
	return getContext<ReturnType<typeof setCtx>>(NAME);
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
