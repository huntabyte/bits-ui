<script lang="ts">
	import { watch } from "runed";
	import { box, mergeProps } from "svelte-toolbelt";
	import { type DateValue } from "@internationalized/date";
	import type { RangeCalendarRootProps } from "../types.js";
	import { RangeCalendarRootState } from "../range-calendar.svelte.js";
	import { noop } from "$lib/internal/noop.js";
	import { createId } from "$lib/internal/create-id.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

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
		...restProps
	}: RangeCalendarRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	const defaultPlaceholder = getDefaultDate({
		defaultValue: value?.start,
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
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value!,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: box.with(
			() => placeholder!,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		preventDeselect: box.with(() => preventDeselect),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		isDateUnavailable: box.with(() => isDateUnavailable),
		isDateDisabled: box.with(() => isDateDisabled),
		pagedNavigation: box.with(() => pagedNavigation),
		weekStartsOn: box.with(() => weekStartsOn),
		weekdayFormat: box.with(() => weekdayFormat),
		numberOfMonths: box.with(() => numberOfMonths),
		locale: resolveLocaleProp(() => locale),
		calendarLabel: box.with(() => calendarLabel),
		fixedWeeks: box.with(() => fixedWeeks),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		minDays: box.with(() => minDays),
		maxDays: box.with(() => maxDays),
		excludeDisabled: box.with(() => excludeDisabled),
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

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
