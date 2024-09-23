<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCommandListViewport } from "../command.svelte.js";
	import type { ListViewportProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: ListViewportProps = $props();

	const listViewportState = useCommandListViewport({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, listViewportState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
