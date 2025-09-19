<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { CalendarYearSelectProps } from "../types.js";
	import { CalendarYearSelectState } from "../calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		years,
		yearFormat = "numeric",
		disabled = false,
		"aria-label": ariaLabel = "Select a year",
		...restProps
	}: CalendarYearSelectProps = $props();

	const yearSelectState = CalendarYearSelectState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		years: boxWith(() => years),
		yearFormat: boxWith(() => yearFormat),
		disabled: boxWith(() => Boolean(disabled)),
	});

	const mergedProps = $derived(
		mergeProps(restProps, yearSelectState.props, { "aria-label": ariaLabel })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...yearSelectState.snippetProps })}
{:else}
	<select {...mergedProps}>
		{#if children}
			{@render children?.(yearSelectState.snippetProps)}
		{:else}
			{#each yearSelectState.yearItems as year (year.value)}
				<option value={year.value} selected={year.value === yearSelectState.currentYear}>
					{year.label}
				</option>
			{/each}
		{/if}
	</select>
{/if}
