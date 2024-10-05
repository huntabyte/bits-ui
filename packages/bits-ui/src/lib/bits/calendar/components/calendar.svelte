<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useCalendarRoot } from "../calendar.svelte.js";
	import type { CalendarRootProps } from "../types.js";
	import { useId } from "$lib/internal/useId.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		weekdayFormat = "narrow",
		weekStartsOn = 0,
		pagedNavigation = false,
		isDateDisabled = () => false,
		isDateUnavailable = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		locale = "en",
		calendarLabel = "Event",
		disabled = false,
		readonly = false,
		minValue = undefined,
		maxValue = undefined,
		preventDeselect = false,
		type,
		disableDaysOutsideMonth = true,
		initialFocus = false,
		controlledValue = false,
		controlledPlaceholder = false,
		...restProps
	}: CalendarRootProps = $props();

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			defaultPlaceholder: undefined,
			defaultValue: value,
		});

		if (controlledPlaceholder) {
			onPlaceholderChange(defaultPlaceholder);
		} else {
			placeholder = defaultPlaceholder;
		}
	}

	if (value === undefined) {
		const defaultValue = type === "single" ? "" : [];
		if (controlledValue) {
			onValueChange(defaultValue as any);
		} else {
			value = defaultValue as any;
		}
	}

	value === undefined && (value = type === "single" ? undefined : []);

	const rootState = useCalendarRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		weekdayFormat: box.with(() => weekdayFormat),
		weekStartsOn: box.with(() => weekStartsOn),
		pagedNavigation: box.with(() => pagedNavigation),
		isDateDisabled: box.with(() => isDateDisabled),
		isDateUnavailable: box.with(() => isDateUnavailable),
		fixedWeeks: box.with(() => fixedWeeks),
		numberOfMonths: box.with(() => numberOfMonths),
		locale: box.with(() => locale),
		calendarLabel: box.with(() => calendarLabel),
		readonly: box.with(() => readonly),
		disabled: box.with(() => disabled),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
		initialFocus: box.with(() => initialFocus),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				if (controlledPlaceholder) {
					onPlaceholderChange(v as DateValue);
				} else {
					placeholder = v;
					onPlaceholderChange(v as DateValue);
				}
			}
		),
		preventDeselect: box.with(() => preventDeselect),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v as any);
				} else {
					value = v;
					onValueChange(v as any);
				}
			}
		),
		type: box.with(() => type),
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
