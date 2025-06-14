<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DatePickerCalendarProps } from "../types.js";
	import { DatePickerRootContext } from "../date-picker.svelte.js";
	import { CalendarRootState } from "$lib/bits/calendar/calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: DatePickerCalendarProps = $props();

	const datePickerRootState = DatePickerRootContext.get();

	const calendarState = CalendarRootState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		calendarLabel: datePickerRootState.opts.calendarLabel,
		fixedWeeks: datePickerRootState.opts.fixedWeeks,
		isDateDisabled: datePickerRootState.opts.isDateDisabled,
		isDateUnavailable: datePickerRootState.opts.isDateUnavailable,
		locale: datePickerRootState.opts.locale,
		numberOfMonths: datePickerRootState.opts.numberOfMonths,
		pagedNavigation: datePickerRootState.opts.pagedNavigation,
		preventDeselect: datePickerRootState.opts.preventDeselect,
		readonly: datePickerRootState.opts.readonly,
		type: box.with(() => "single"),
		weekStartsOn: datePickerRootState.opts.weekStartsOn,
		weekdayFormat: datePickerRootState.opts.weekdayFormat,
		disabled: datePickerRootState.opts.disabled,
		disableDaysOutsideMonth: datePickerRootState.opts.disableDaysOutsideMonth,
		maxValue: datePickerRootState.opts.maxValue,
		minValue: datePickerRootState.opts.minValue,
		placeholder: datePickerRootState.opts.placeholder,
		value: datePickerRootState.opts.value,
		onDateSelect: datePickerRootState.opts.onDateSelect,
		initialFocus: datePickerRootState.opts.initialFocus,
		defaultPlaceholder: datePickerRootState.opts.defaultPlaceholder,
		maxDays: box.with(() => undefined),
		monthFormat: datePickerRootState.opts.monthFormat,
		yearFormat: datePickerRootState.opts.yearFormat,
	});

	const mergedProps = $derived(mergeProps(restProps, calendarState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...calendarState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(calendarState.snippetProps)}
	</div>
{/if}
