<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useCalendarGrid } from "../calendar.svelte.js";
	import type { GridProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: GridProps = $props();

	const gridState = useCalendarGrid({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<table {...mergedProps}>
		{@render children?.()}
	</table>
{/if}
