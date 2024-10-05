<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RangeCalendarDayProps } from "../types.js";
	import { useRangeCalendarDay } from "../range-calendar.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		...restProps
	}: RangeCalendarDayProps = $props();

	const dayState = useRangeCalendarDay({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, dayState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...dayState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.(dayState.snippetProps)}
		{:else}
			{dayState.cell.date.current.day}
		{/if}
	</div>
{/if}
