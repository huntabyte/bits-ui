<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useCalendarCell } from "../calendar.svelte.js";
	import type { CellProps } from "../index.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		date,
		month,
		...restProps
	}: CellProps = $props();

	const cellState = useCalendarCell({
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
	{@render child?.({
		props: mergedProps,
		...cellState.snippetProps,
	})}
{:else}
	<td {...mergedProps}>
		{@render children?.(cellState.snippetProps)}
	</td>
{/if}
