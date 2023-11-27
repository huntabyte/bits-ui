import { createDatePicker, type CreateDatePickerProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater } from "$lib/internal/index.js";
import { getAttrs as getCalendarAttrs } from "$lib/bits/calendar/ctx.js";
import { getAttrs as getFieldAttrs } from "$lib/bits/date-field/ctx.js";
import { getAttrs as getPopoverAttrs } from "$lib/bits/popover/ctx.js";
import { getPositioningUpdater, type PositioningProps } from "../floating/helpers";
import { get, type Writable } from "svelte/store";
import type { FloatingConfig } from "../floating/floating-config";

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
} satisfies PositioningProps;

export function updatePositioning(props: PositioningProps) {
	console.log("updating positioning");
	const withDefaults = { ...defaultPlacement, ...props } satisfies PositioningProps;
	const {
		options: { positioning }
	} = getCtx();

	const updater = getPositioningUpdater(positioning as Writable<FloatingConfig>);
	updater(withDefaults);
	console.log(get(positioning));
}
