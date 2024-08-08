<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { GridBodyProps } from "../index.js";
	import { useCalendarGridBody } from "../calendar.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: GridBodyProps = $props();

	const gridBodyState = useCalendarGridBody({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridBodyState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tbody {...mergedProps}>
		{@render children?.()}
	</tbody>
{/if}
