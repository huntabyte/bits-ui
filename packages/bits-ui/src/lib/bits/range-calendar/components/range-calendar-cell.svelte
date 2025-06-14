<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RangeCalendarCellProps } from "../types.js";
	import { RangeCalendarCellState } from "../range-calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		date,
		month,
		...restProps
	}: RangeCalendarCellProps = $props();

	const cellState = RangeCalendarCellState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		date: box.with(() => date),
		month: box.with(() => month),
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
