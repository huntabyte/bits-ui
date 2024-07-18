<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DayProps } from "../index.js";
	import { useRangeCalendarDay } from "../range-calendar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { children, child, id = useId(), ref = $bindable(null), ...restProps }: DayProps = $props();

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
	{@render child?.({ props: mergedProps, ...dayState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(dayState.snippetProps)}
	</div>
{/if}
