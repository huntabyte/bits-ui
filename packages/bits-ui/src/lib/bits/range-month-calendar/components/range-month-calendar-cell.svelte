<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RangeMonthCalendarCellProps } from "../types.js";
	import { RangeMonthCalendarCellState } from "../range-month-calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		month,
		year,
		...restProps
	}: RangeMonthCalendarCellProps = $props();

	const cellState = RangeMonthCalendarCellState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		date: box.with(() => month),
		year: box.with(() => year),
	});

	const mergedProps = $derived(mergeProps(restProps, cellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...cellState.snippetProps })}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
