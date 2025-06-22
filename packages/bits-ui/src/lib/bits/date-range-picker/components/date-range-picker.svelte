<script lang="ts">
	import { watch } from "runed";
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { DateRangePickerRootState } from "../date-range-picker.svelte.js";
	import type { DateRangePickerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { PopoverRootState } from "$lib/bits/popover/popover.svelte.js";
	import { DateRangeFieldRootState } from "$lib/bits/date-range-field/date-range-field.svelte.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		value = $bindable(),
		id = useId(),
		ref = $bindable(null),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		isDateUnavailable = () => false,
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
		closeOnRangeSelect = true,
		onStartValueChange = noop,
		onEndValueChange = noop,
		validate = noop,
		errorMessageId,
		minDays,
		maxDays,
		excludeDisabled = false,
		child,
		children,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: DateRangePickerRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = { start: undefined, end: undefined };
	}

	// SSR
	handleDefaultValue();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make value
	 * undefined which causes errors to be thrown.
	 */
	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const defaultPlaceholder = getDefaultDate({
		granularity,
		defaultValue: value?.start,
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

	function onRangeSelect() {
		if (closeOnRangeSelect) {
			open = false;
		}
	}

	const pickerRootState = DateRangePickerRootState.create({
		open: box.with(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		value: box.with(
			() => value as DateRange,
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
		minDays: box.with(() => minDays),
		maxDays: box.with(() => maxDays),
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
		excludeDisabled: box.with(() => excludeDisabled),
		onRangeSelect: box.with(() => onRangeSelect),
		startValue: box.with(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: box.with(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		monthFormat: box.with(() => monthFormat),
		yearFormat: box.with(() => yearFormat),
		defaultPlaceholder,
	});

	PopoverRootState.create({
		open: pickerRootState.opts.open,
		onOpenChangeComplete: box.with(() => onOpenChangeComplete),
	});

	const fieldRootState = DateRangeFieldRootState.create({
		value: pickerRootState.opts.value,
		disabled: pickerRootState.opts.disabled,
		readonly: pickerRootState.opts.readonly,
		readonlySegments: pickerRootState.opts.readonlySegments,
		validate: box.with(() => validate),
		minValue: pickerRootState.opts.minValue,
		maxValue: pickerRootState.opts.maxValue,
		granularity: pickerRootState.opts.granularity,
		hideTimeZone: pickerRootState.opts.hideTimeZone,
		hourCycle: pickerRootState.opts.hourCycle,
		locale: pickerRootState.opts.locale,
		required: pickerRootState.opts.required,
		placeholder: pickerRootState.opts.placeholder,
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		startValue: pickerRootState.opts.startValue,
		endValue: pickerRootState.opts.endValue,
		onInvalid: box.with(() => onInvalid),
		errorMessageId: box.with(() => errorMessageId),
	});

	const mergedProps = $derived(mergeProps(restProps, fieldRootState.props));
</script>

<FloatingLayer>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer>
