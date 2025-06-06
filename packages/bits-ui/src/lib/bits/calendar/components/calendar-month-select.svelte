<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CalendarMonthSelectProps } from "../types.js";
	import { useCalendarMonthSelect } from "../calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
		monthFormat = "long",
		disabled = false,
		...restProps
	}: CalendarMonthSelectProps = $props();

	const monthSelectState = useCalendarMonthSelect({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		months: box.with(() => months),
		monthFormat: box.with(() => monthFormat),
		disabled: box.with(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, monthSelectState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, months: monthSelectState.months })}
{:else}
	<select {...mergedProps}>
		{#if children}
			{@render children?.({ months: monthSelectState.months })}
		{:else}
			{#each monthSelectState.months as month (month.value)}
				<option
					value={month.value}
					selected={month.value === monthSelectState.currentMonth}
				>
					{month.label}
				</option>
			{/each}
		{/if}
	</select>
{/if}
