<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { CalendarWeekNumberCellState } from "../calendar.svelte.js";
	import { CalendarRootContext } from "../calendar.svelte.js";
	import type { CalendarWeekNumberCellProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		week,
		...restProps
	}: CalendarWeekNumberCellProps = $props();

	const root = CalendarRootContext.get();

	const cellState = CalendarWeekNumberCellState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		week: boxWith(() => week),
	});

	const mergedProps = $derived(mergeProps(restProps, cellState.props));
</script>

{#if root.opts.showWeekNumbers.current}
	{#if child}
		{@render child({ props: mergedProps, ...cellState.snippetProps })}
	{:else}
		<td {...mergedProps}>
			{#if children}
				{@render children(cellState.snippetProps)}
			{:else}
				{String(cellState.weekNumber).padStart(2, "0")}
			{/if}
		</td>
	{/if}
{/if}
