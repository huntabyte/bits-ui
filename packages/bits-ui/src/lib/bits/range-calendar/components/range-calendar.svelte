<script lang="ts">
	import { watch } from "runed";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { type DateValue } from "@internationalized/date";
	import type { RangeCalendarRootProps } from "../types.js";
	import { RangeCalendarRootState } from "../range-calendar.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";
	import type { Month } from "$lib/shared/index.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		weekdayFormat = "narrow",
		weekStartsOn,
		pagedNavigation = false,
		isDateDisabled = () => false,
		isDateUnavailable = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		locale,
		calendarLabel = "Event",
		disabled = false,
		readonly = false,
		minValue = undefined,
		maxValue = undefined,
		preventDeselect = false,
		disableDaysOutsideMonth = true,
		minDays,
		maxDays,
		onStartValueChange = noop,
		onEndValueChange = noop,
		excludeDisabled = false,
		monthFormat = "long",
		yearFormat = "numeric",
		onVisibleMonthsChange = noop,
		...restProps
	}: RangeCalendarRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);
	let months = $state.raw<Month<DateValue>[]>([]);

	const defaultPlaceholder = getDefaultDate({
		defaultValue: value?.start,
		minValue,
		maxValue,
	});

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	watch.pre(
		() => placeholder,
		() => {
			handleDefaultPlaceholder();
		}
	);

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = { start: undefined, end: undefined };
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = RangeCalendarRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		value: boxWith(
			() => value!,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: boxWith(
			() => placeholder!,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		disabled: boxWith(() => disabled),
		readonly: boxWith(() => readonly),
		preventDeselect: boxWith(() => preventDeselect),
		minValue: boxWith(() => minValue),
		maxValue: boxWith(() => maxValue),
		isDateUnavailable: boxWith(() => isDateUnavailable),
		isDateDisabled: boxWith(() => isDateDisabled),
		pagedNavigation: boxWith(() => pagedNavigation),
		weekStartsOn: boxWith(() => weekStartsOn),
		weekdayFormat: boxWith(() => weekdayFormat),
		numberOfMonths: boxWith(() => numberOfMonths),
		locale: resolveLocaleProp(() => locale),
		calendarLabel: boxWith(() => calendarLabel),
		fixedWeeks: boxWith(() => fixedWeeks),
		disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
		minDays: boxWith(() => minDays),
		maxDays: boxWith(() => maxDays),
		excludeDisabled: boxWith(() => excludeDisabled),
		months: boxWith(
			() => months,
			(v) => {
				months = v;
				onVisibleMonthsChange(v);
			}
		),
		startValue: boxWith(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: boxWith(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		monthFormat: boxWith(() => monthFormat),
		yearFormat: boxWith(() => yearFormat),
		defaultPlaceholder,
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
