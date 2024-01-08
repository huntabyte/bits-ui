import { createDatePicker, type CreateDatePickerProps } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";
import { removeUndefined, getOptionUpdater, createBitAttrs } from "$lib/internal/index.js";
import { getCalendarData } from "$lib/bits/calendar/ctx.js";
import { getDateFieldData } from "$lib/bits/date-field/ctx.js";
import { getPopoverData } from "$lib/bits/popover/ctx.js";
import { getPositioningUpdater } from "$lib/bits/floating/helpers.js";
import type { Writable } from "svelte/store";
import type { FloatingConfig } from "$lib/bits/floating/floating-config.js";
import type { FloatingProps } from "$lib/bits/floating/_types.js";

function getDatePickerData() {
	const NAME = "date-picker" as const;
	return {
		NAME
	};
}

export function setCtx(props: CreateDatePickerProps) {
	const { NAME } = getDatePickerData();
	const { NAME: CALENDAR_NAME, PARTS: CALENDAR_PARTS } = getCalendarData();
	const getCalendarAttrs = createBitAttrs(CALENDAR_NAME, CALENDAR_PARTS);
	const { NAME: FIELD_NAME, PARTS: FIELD_PARTS } = getDateFieldData();
	const getFieldAttrs = createBitAttrs(FIELD_NAME, FIELD_PARTS);
	const { NAME: POPOVER_NAME, PARTS: POPOVER_PARTS } = getPopoverData();
	const getPopoverAttrs = createBitAttrs(POPOVER_NAME, POPOVER_PARTS);

	const datePicker = {
		...createDatePicker({ ...removeUndefined(props), forceVisible: true }),
		getCalendarAttrs,
		getFieldAttrs,
		getPopoverAttrs
	};
	const updateOption = getOptionUpdater(datePicker.options);
	setContext(NAME, { ...datePicker, updateOption });

	return {
		...datePicker,
		updateOption
	};
}

export function getCtx() {
	const { NAME } = getDatePickerData();
	return getContext<ReturnType<typeof setCtx>>(NAME);
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
