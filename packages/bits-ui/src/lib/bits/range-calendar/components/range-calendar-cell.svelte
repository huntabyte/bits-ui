<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import type { CellProps } from "../index.js";
	import { useRangeCalendarCell } from "../range-calendar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		date,
		month,
		...restProps
	}: CellProps = $props();

	const cellState = useRangeCalendarCell({
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

{#if asChild}
	{@render child?.({ props: mergedProps, ...cellState.snippetProps })}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
