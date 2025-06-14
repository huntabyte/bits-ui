<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CalendarDayState } from "../calendar.svelte.js";
	import type { CalendarDayProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarDayProps = $props();

	const dayState = CalendarDayState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, dayState.props));
</script>

{#if child}
	{@render child({
		props: mergedProps,
		...dayState.snippetProps,
	})}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.(dayState.snippetProps)}
		{:else}
			{dayState.cell.opts.date.current.day}
		{/if}
	</div>
{/if}
