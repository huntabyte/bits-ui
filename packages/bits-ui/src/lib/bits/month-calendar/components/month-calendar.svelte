<script lang="ts">
	import { watch } from "runed";
	import { box, mergeProps } from "svelte-toolbelt";
	import { type DateValue } from "@internationalized/date";
	import { MonthCalendarRootState } from "../month-calendar.svelte.js";
	import type { MonthCalendarRootProps } from "../types.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

	let {
		child,
		children,
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		pagedNavigation = false,
		isMonthDisabled = () => false,
		isMonthUnavailable = () => false,
		numberOfYears = 1,
		locale,
		calendarLabel = "Event",
		disabled = false,
		readonly = false,
		minValue = undefined,
		maxValue = undefined,
		preventDeselect = false,
		type,
		initialFocus = false,
		maxMonths,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: MonthCalendarRootProps = $props();

	const defaultPlaceholder = getDefaultDate({
		defaultValue: value,
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
		value = type === "single" ? undefined : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = MonthCalendarRootState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		pagedNavigation: box.with(() => pagedNavigation),
		isUnitDisabled: box.with(() => isMonthDisabled),
		isUnitUnavailable: box.with(() => isMonthUnavailable),
		numberOfYears: box.with(() => numberOfYears),
		locale: resolveLocaleProp(() => locale),
		calendarLabel: box.with(() => calendarLabel),
		readonly: box.with(() => readonly),
		disabled: box.with(() => disabled),
		minValue: box.with(() => minValue),
		maxValue: box.with(() => maxValue),
		initialFocus: box.with(() => initialFocus),
		maxUnits: box.with(() => maxMonths),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		preventDeselect: box.with(() => preventDeselect),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onValueChange(v as any);
			}
		),
		type: box.with(() => type),
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
