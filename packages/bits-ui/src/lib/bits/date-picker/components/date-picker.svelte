<script lang="ts">
	// Date Picker composes the DateField, Popover, and Calendar components
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDatePickerRoot } from "../date-picker.svelte.js";
	import type { RootProps } from "../index.js";
	import { getDefaultDate } from "$lib/shared/date/utils.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { usePopoverRoot } from "$lib/bits/popover/popover.svelte.js";
	import { useDateFieldRoot } from "$lib/bits/date-field/date-field.svelte.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		open = false,
		onOpenChange = noop,
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		isDateUnavailable = () => false,
		minValue,
		maxValue,
		disabled = false,
		readonly = false,
		granularity,
		readonlySegments = [],
		hourCycle,
		locale = "en",
		hideTimeZone = false,
		required = false,
		name = "",
		calendarLabel = "Event",
		disableDaysOutsideMonth = true,
		preventDeselect = false,
		pagedNavigation = false,
		weekStartsOn = 0,
		weekdayFormat = "narrow",
		isDateDisabled = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		closeOnDateSelect = true,
		children,
	}: RootProps = $props();

	if (placeholder === undefined) {
		placeholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value,
		});
	}

	function onDateSelect() {
		if (closeOnDateSelect) {
			open = false;
		}
	}

	const pickerRootState = useDatePickerRoot({
		open: box.with(
			() => open,
			(v) => {
				if (open !== v) {
					open = v;
					onOpenChange(v);
				}
			}
		),
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}
		),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				if (placeholder !== v) {
					placeholder = v;
					onPlaceholderChange(v as DateValue);
				}
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
		locale: box.with(() => locale),
		hideTimeZone: box.with(() => hideTimeZone),
		required: box.with(() => required),
		name: box.with(() => name),
		calendarLabel: box.with(() => calendarLabel),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		preventDeselect: box.with(() => preventDeselect),
		pagedNavigation: box.with(() => pagedNavigation),
		weekStartsOn: box.with(() => weekStartsOn),
		weekdayFormat: box.with(() => weekdayFormat),
		isDateDisabled: box.with(() => isDateDisabled),
		fixedWeeks: box.with(() => fixedWeeks),
		numberOfMonths: box.with(() => numberOfMonths),
		onDateSelect: box.with(() => onDateSelect),
	});

	usePopoverRoot({
		open: pickerRootState.props.open,
	});

	useDateFieldRoot({
		value: pickerRootState.props.value,
		disabled: pickerRootState.props.disabled,
		readonly: pickerRootState.props.readonly,
		readonlySegments: pickerRootState.props.readonlySegments,
		isDateUnavailable: pickerRootState.props.isDateUnavailable,
		minValue: pickerRootState.props.minValue,
		maxValue: pickerRootState.props.maxValue,
		granularity: pickerRootState.props.granularity,
		hideTimeZone: pickerRootState.props.hideTimeZone,
		hourCycle: pickerRootState.props.hourCycle,
		locale: pickerRootState.props.locale,
		name: pickerRootState.props.name,
		required: pickerRootState.props.required,
		placeholder: pickerRootState.props.placeholder,
	});
</script>

<FloatingLayer.Root>
	{@render children?.()}
</FloatingLayer.Root>
