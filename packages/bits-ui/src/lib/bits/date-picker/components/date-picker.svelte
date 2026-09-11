<script lang="ts">
	// Date Picker composes the DateField, Popover, and Calendar components
	import { watch } from "runed";
	import { boxWith } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { DatePickerRootState } from "../date-picker.svelte.js";
	import type { DatePickerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { PopoverRootState } from "$lib/bits/popover/popover.svelte.js";
	import { DateFieldRootState } from "$lib/bits/date-field/date-field.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";
	import type { Month } from "$lib/shared/index.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		isDateUnavailable = () => false,
		validate = noop,
		onInvalid = noop,
		minValue,
		maxValue,
		disabled = false,
		readonly = false,
		granularity,
		readonlySegments = [],
		hourCycle,
		locale,
		hideTimeZone = false,
		required = false,
		calendarLabel = "Event",
		disableDaysOutsideMonth = true,
		preventDeselect = false,
		pagedNavigation = false,
		weekStartsOn,
		weekdayFormat = "narrow",
		isDateDisabled = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		closeOnDateSelect = true,
		initialFocus = false,
		errorMessageId,
		children,
		monthFormat = "long",
		yearFormat = "numeric",
		onVisibleMonthsChange = noop,
	}: DatePickerRootProps = $props();

	let months = $state<Month<DateValue>[]>([]);

	const defaultPlaceholder = getDefaultDate({
		granularity,
		defaultValue: value,
		minValue,
		maxValue,
	});

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make placeholder
	 * undefined which causes errors to be thrown.
	 */
	watch.pre(
		() => placeholder,
		() => {
			handleDefaultPlaceholder();
		}
	);

	function onDateSelect() {
		if (closeOnDateSelect) {
			open = false;
		}
	}

	const pickerRootState = DatePickerRootState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: boxWith(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		isDateUnavailable: boxWith(() => isDateUnavailable),
		minValue: boxWith(() => minValue),
		maxValue: boxWith(() => maxValue),
		disabled: boxWith(() => disabled),
		readonly: boxWith(() => readonly),
		granularity: boxWith(() => granularity),
		readonlySegments: boxWith(() => readonlySegments),
		hourCycle: boxWith(() => hourCycle),
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: boxWith(() => hideTimeZone),
		required: boxWith(() => required),
		calendarLabel: boxWith(() => calendarLabel),
		disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
		preventDeselect: boxWith(() => preventDeselect),
		pagedNavigation: boxWith(() => pagedNavigation),
		weekStartsOn: boxWith(() => weekStartsOn),
		weekdayFormat: boxWith(() => weekdayFormat),
		isDateDisabled: boxWith(() => isDateDisabled),
		fixedWeeks: boxWith(() => fixedWeeks),
		numberOfMonths: boxWith(() => numberOfMonths),
		initialFocus: boxWith(() => initialFocus),
		onDateSelect: boxWith(() => onDateSelect),
		months: boxWith(
			() => months,
			(v) => {
				months = v;
				onVisibleMonthsChange(v);
			}
		),
		defaultPlaceholder,
		monthFormat: boxWith(() => monthFormat),
		yearFormat: boxWith(() => yearFormat),
	});

	PopoverRootState.create({
		open: pickerRootState.opts.open,
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});

	DateFieldRootState.create({
		value: pickerRootState.opts.value,
		disabled: pickerRootState.opts.disabled,
		readonly: pickerRootState.opts.readonly,
		readonlySegments: pickerRootState.opts.readonlySegments,
		validate: boxWith(() => validate),
		onInvalid: boxWith(() => onInvalid),
		minValue: pickerRootState.opts.minValue,
		maxValue: pickerRootState.opts.maxValue,
		granularity: pickerRootState.opts.granularity,
		hideTimeZone: pickerRootState.opts.hideTimeZone,
		hourCycle: pickerRootState.opts.hourCycle,
		locale: pickerRootState.opts.locale,
		required: pickerRootState.opts.required,
		placeholder: pickerRootState.opts.placeholder,
		errorMessageId: boxWith(() => errorMessageId),
		isInvalidProp: boxWith(() => undefined),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
