<script lang="ts">
	import { handleCalendarInitialFocus } from "$lib/internal/focus.js";
	import { createDispatcher } from "$lib/internal/events.js";
	import { melt } from "@melt-ui/svelte";
	import { onMount } from "svelte";
	import { setCtx, getAttrs } from "../ctx.js";
	import type { Props } from "../types.js";

	type Multiple = $$Generic<boolean>;
	type $$Props = Props<Multiple>;

	export let placeholder: $$Props["placeholder"] = undefined;
	export let onPlaceholderChange: $$Props["onPlaceholderChange"] = undefined;
	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let preventDeselect: $$Props["preventDeselect"] = undefined;
	export let minValue: $$Props["minValue"] = undefined;
	export let maxValue: $$Props["maxValue"] = undefined;
	export let pagedNavigation: $$Props["pagedNavigation"] = undefined;
	export let weekStartsOn: $$Props["weekStartsOn"] = undefined;
	export let locale: $$Props["locale"] = undefined;
	export let isDateUnavailable: $$Props["isDateUnavailable"] = undefined;
	export let isDateDisabled: $$Props["isDateDisabled"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let readonly: $$Props["readonly"] = undefined;
	export let fixedWeeks: $$Props["fixedWeeks"] = undefined;
	export let calendarLabel: $$Props["calendarLabel"] = undefined;
	export let weekdayFormat: $$Props["weekdayFormat"] = undefined;
	export let multiple: $$Props["multiple"] = false as Multiple;
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let numberOfMonths: $$Props["numberOfMonths"] = undefined;
	export let initialFocus: $$Props["initialFocus"] = false;

	let el: HTMLElement | undefined = undefined;

	onMount(() => {
		if (!initialFocus || !el) return;
		handleCalendarInitialFocus(el);
	});

	const {
		elements: { calendar },
		states: {
			value: localValue,
			placeholder: localPlaceholder,
			months,
			weekdays
		},
		updateOption,
		ids
	} = setCtx({
		defaultPlaceholder: placeholder,
		defaultValue: value,
		preventDeselect,
		minValue,
		maxValue,
		pagedNavigation,
		weekStartsOn,
		locale,
		isDateUnavailable,
		isDateDisabled,
		disabled,
		readonly,
		fixedWeeks,
		calendarLabel,
		weekdayFormat,
		multiple,
		numberOfMonths,
		onPlaceholderChange: ({ next }) => {
			if (placeholder !== next) {
				onPlaceholderChange?.(next);
				placeholder = next;
			}
			return next;
		},
		onValueChange: ({ next }: { next: $$Props["value"] }) => {
			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		}
	});

	$: if (id) {
		ids.calendar.set(id);
	}

	$: value !== undefined && localValue.set(value);
	$: placeholder !== undefined && localPlaceholder.set(placeholder);

	$: updateOption("preventDeselect", preventDeselect);
	$: updateOption("minValue", minValue);
	$: updateOption("maxValue", maxValue);
	$: updateOption("pagedNavigation", pagedNavigation);
	$: updateOption("weekStartsOn", weekStartsOn);
	$: updateOption("locale", locale);
	$: updateOption("isDateUnavailable", isDateUnavailable);
	$: updateOption("isDateDisabled", isDateDisabled);
	$: updateOption("disabled", disabled);
	$: updateOption("readonly", readonly);
	$: updateOption("fixedWeeks", fixedWeeks);
	$: updateOption("calendarLabel", calendarLabel);
	$: updateOption("weekdayFormat", weekdayFormat);
	$: updateOption("numberOfMonths", numberOfMonths);

	const attrs = getAttrs("root");

	$: builder = $calendar;
	$: Object.assign(builder, attrs);
	const dispatch = createDispatcher();

	$: slotProps = {
		builder,
		months: $months,
		weekdays: $weekdays
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
		bind:this={el}
	>
		<slot {...slotProps} />
	</div>
{/if}
