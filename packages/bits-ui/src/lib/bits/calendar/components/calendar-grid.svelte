<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { CalendarGridState } from "../calendar.svelte.js";
	import type { CalendarGridProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: CalendarGridProps = $props();

	const gridState = CalendarGridState.create({
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
