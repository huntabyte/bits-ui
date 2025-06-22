<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RangeCalendarDayProps } from "../types.js";
	import { RangeCalendarDayState } from "../range-calendar.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		...restProps
	}: RangeCalendarDayProps = $props();

	const dayState = RangeCalendarDayState.create({
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
			{dayState.cell.opts.date.current.day}
		{/if}
	</div>
{/if}
