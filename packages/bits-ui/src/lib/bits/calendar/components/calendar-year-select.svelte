<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { CalendarYearSelectProps } from "../types.js";
	import { useCalendarYearSelect } from "../calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		years: yearsProp,
		disabled = false,
		...restProps
	}: CalendarYearSelectProps = $props();

	const years = $derived.by(() => {
		if (yearsProp) return yearsProp;
		const currentYear = new Date().getFullYear();
		return Array.from({ length: 101 }, (_, i) => currentYear - 100 + i);
	});

	const yearSelectState = useCalendarYearSelect({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		years: box.with(() => years),
		disabled: box.with(() => Boolean(disabled)),
	});

	const mergedProps = $derived(mergeProps(restProps, yearSelectState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, years: yearSelectState.opts.years.current })}
{:else}
	<select {...mergedProps}>
		{#if children}
			{@render children?.({ years: yearSelectState.opts.years.current })}
		{:else}
			{#each yearSelectState.opts.years.current as year (year)}
				<option value={year} selected={year === yearSelectState.currentYear}>
					{year}
				</option>
			{/each}
		{/if}
	</select>
{/if}
