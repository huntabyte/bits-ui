<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useRangeCalendarRoot } from "../range-calendar.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { getDefaultDate } from "$lib/shared/date/utils.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
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
		disableDaysOutsideMonth = true,
		...restProps
	}: RootProps = $props();

	if (placeholder === undefined) {
		placeholder = getDefaultDate({
			defaultPlaceholder: undefined,
			defaultValue: value?.start,
		});
	}

	value === undefined && (value = { start: undefined, end: undefined });

	const rootState = useRangeCalendarRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => (value === undefined ? { start: undefined, end: undefined } : value),
			(v) => {
				if (v !== value) {
					value = v;
					onValueChange(v as any);
				}
			}
		),
		placeholder: box.with(
			() =>
				placeholder === undefined
					? getDefaultDate({
							defaultPlaceholder: undefined,
							defaultValue: value?.start,
						})
					: placeholder,
			(v) => {
				if (placeholder === undefined) {
					placeholder = getDefaultDate({
						defaultPlaceholder: undefined,
						defaultValue: value?.start,
					});
					onPlaceholderChange(placeholder);
				}
				if (v !== placeholder) {
					placeholder = v;
					onPlaceholderChange(v as any);
				}
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
		locale: box.with(() => locale),
		calendarLabel: box.with(() => calendarLabel),
		fixedWeeks: box.with(() => fixedWeeks),
		disableDaysOutsideMonth: box.with(() => disableDaysOutsideMonth),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}
