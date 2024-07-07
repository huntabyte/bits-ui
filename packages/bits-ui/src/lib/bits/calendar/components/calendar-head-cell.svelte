<script lang="ts">
	import { useId } from "$lib/internal/useId.svelte.js";
	import { box } from "svelte-toolbelt";
	import { useCalendarHeadCell } from "../calendar.svelte.js";
	import type { HeadCellProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: HeadCellProps = $props();

	const headCellState = useCalendarHeadCell({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, headCellState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<th {...mergedProps}>
		{@render children?.()}
	</th>
{/if}
