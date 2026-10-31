<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { CalendarWeekNumberHeadCellState } from "../calendar.svelte.js";
	import { CalendarRootContext } from "../calendar.svelte.js";
	import type { CalendarWeekNumberHeadCellProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarWeekNumberHeadCellProps = $props();

	const root = CalendarRootContext.get();

	const headCellState = CalendarWeekNumberHeadCellState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headCellState.props));
</script>

{#if root.opts.showWeekNumbers.current}
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<th {...mergedProps}>
			{@render children?.()}
		</th>
	{/if}
{/if}
