<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useCalendarGridRow } from "../calendar.svelte.js";
	import type { GridRowProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		...restProps
	}: GridRowProps = $props();

	const gridRowState = useCalendarGridRow({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, gridRowState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<tr {...mergedProps}>
		{@render children?.()}
	</tr>
{/if}
