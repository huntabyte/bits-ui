<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CalendarHeadCellState } from "../calendar.svelte.js";
	import type { CalendarHeadCellProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarHeadCellProps = $props();

	const headCellState = CalendarHeadCellState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headCellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<th {...mergedProps}>
		{@render children?.()}
	</th>
{/if}
