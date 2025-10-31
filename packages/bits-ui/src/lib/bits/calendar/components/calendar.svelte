<script lang="ts">
	import { watch } from "runed";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { type DateValue } from "@internationalized/date";
	import { CalendarRootState } from "../calendar.svelte.js";
	import type { CalendarRootProps } from "../types.js";
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
		type,
		disableDaysOutsideMonth = true,
		initialFocus = false,
		maxDays,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: CalendarRootProps = $props();

	const defaultPlaceholder = getDefaultDate({
		defaultValue: value,
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

	const rootState = CalendarRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		weekdayFormat: boxWith(() => weekdayFormat),
		weekStartsOn: boxWith(() => weekStartsOn),
		pagedNavigation: boxWith(() => pagedNavigation),
		isDateDisabled: boxWith(() => isDateDisabled),
		isDateUnavailable: boxWith(() => isDateUnavailable),
		fixedWeeks: boxWith(() => fixedWeeks),
		numberOfMonths: boxWith(() => numberOfMonths),
		locale: resolveLocaleProp(() => locale),
		calendarLabel: boxWith(() => calendarLabel),
		readonly: boxWith(() => readonly),
		disabled: boxWith(() => disabled),
		minValue: boxWith(() => minValue),
		maxValue: boxWith(() => maxValue),
		disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
		initialFocus: boxWith(() => initialFocus),
		maxDays: boxWith(() => maxDays),
		placeholder: boxWith(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		preventDeselect: boxWith(() => preventDeselect),
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				// oxlint-disable-next-line no-explicit-any
				onValueChange(v as any);
			}
		),
		type: boxWith(() => type),
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
