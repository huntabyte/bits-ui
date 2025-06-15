<script lang="ts">
	// Date Picker composes the DateField, Popover, and Calendar components
	import { watch } from "runed";
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { DatePickerRootState } from "../date-picker.svelte.js";
	import type { DatePickerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { PopoverRootState } from "$lib/bits/popover/popover.svelte.js";
	import { DateFieldRootState } from "$lib/bits/date-field/date-field.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

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
	}: DatePickerRootProps = $props();

	const defaultPlaceholder = getDefaultDate({
		granularity,
		defaultValue: value,
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
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		isDateUnavailable: box.with(() => isDateUnavailable),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		granularity: box.with(() => granularity),
		readonlySegments: box.with(() => readonlySegments),
		hourCycle: box.with(() => hourCycle),
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: box.with(() => hideTimeZone),
		required: box.with(() => required),
		calendarLabel: box.with(() => calendarLabel),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		preventDeselect: box.with(() => preventDeselect),
		pagedNavigation: box.with(() => pagedNavigation),
		weekStartsOn: box.with(() => weekStartsOn),
		weekdayFormat: box.with(() => weekdayFormat),
		isDateDisabled: box.with(() => isDateDisabled),
		fixedWeeks: box.with(() => fixedWeeks),
		numberOfMonths: box.with(() => numberOfMonths),
		initialFocus: box.with(() => initialFocus),
		onDateSelect: box.with(() => onDateSelect),
		defaultPlaceholder,
		monthFormat: box.with(() => monthFormat),
		yearFormat: box.with(() => yearFormat),
	});

	PopoverRootState.create({
		open: pickerRootState.opts.open,
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
	});

	DateFieldRootState.create({
		value: pickerRootState.opts.value,
		disabled: pickerRootState.opts.disabled,
		readonly: pickerRootState.opts.readonly,
		readonlySegments: pickerRootState.opts.readonlySegments,
		validate: box.with(() => validate),
		onInvalid: box.with(() => onInvalid),
		minValue: pickerRootState.opts.minValue,
		maxValue: pickerRootState.opts.maxValue,
		granularity: pickerRootState.opts.granularity,
		hideTimeZone: pickerRootState.opts.hideTimeZone,
		hourCycle: pickerRootState.opts.hourCycle,
		locale: pickerRootState.opts.locale,
		required: pickerRootState.opts.required,
		placeholder: pickerRootState.opts.placeholder,
		errorMessageId: box.with(() => errorMessageId),
		isInvalidProp: box.with(() => undefined),
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
