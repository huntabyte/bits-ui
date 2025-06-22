<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateRangePickerCalendarProps } from "../types.js";
	import { DateRangePickerRootContext } from "../date-range-picker.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { RangeCalendarRootState } from "$lib/bits/range-calendar/range-calendar.svelte.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: DateRangePickerCalendarProps = $props();

	const dateRangePickerRootState = DateRangePickerRootContext.get();

	const rangeCalendarState = RangeCalendarRootState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		calendarLabel: dateRangePickerRootState.opts.calendarLabel,
		fixedWeeks: dateRangePickerRootState.opts.fixedWeeks,
		isDateDisabled: dateRangePickerRootState.opts.isDateDisabled,
		isDateUnavailable: dateRangePickerRootState.opts.isDateUnavailable,
		locale: dateRangePickerRootState.opts.locale,
		numberOfMonths: dateRangePickerRootState.opts.numberOfMonths,
		pagedNavigation: dateRangePickerRootState.opts.pagedNavigation,
		preventDeselect: dateRangePickerRootState.opts.preventDeselect,
		readonly: dateRangePickerRootState.opts.readonly,
		weekStartsOn: dateRangePickerRootState.opts.weekStartsOn,
		weekdayFormat: dateRangePickerRootState.opts.weekdayFormat,
		disabled: dateRangePickerRootState.opts.disabled,
		disableDaysOutsideMonth: dateRangePickerRootState.opts.disableDaysOutsideMonth,
		maxValue: dateRangePickerRootState.opts.maxValue,
		minValue: dateRangePickerRootState.opts.minValue,
		placeholder: dateRangePickerRootState.opts.placeholder,
		value: dateRangePickerRootState.opts.value,
		excludeDisabled: dateRangePickerRootState.opts.excludeDisabled,
		onRangeSelect: dateRangePickerRootState.opts.onRangeSelect,
		startValue: dateRangePickerRootState.opts.startValue,
		endValue: dateRangePickerRootState.opts.endValue,
		defaultPlaceholder: dateRangePickerRootState.opts.defaultPlaceholder,
		minDays: dateRangePickerRootState.opts.minDays,
		maxDays: dateRangePickerRootState.opts.maxDays,
		monthFormat: dateRangePickerRootState.opts.monthFormat,
		yearFormat: dateRangePickerRootState.opts.yearFormat,
	});

	const mergedProps = $derived(mergeProps(restProps, rangeCalendarState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rangeCalendarState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rangeCalendarState.snippetProps)}
	</div>
{/if}
