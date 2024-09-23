<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import { useCommandViewport } from "../command.svelte.js";
	import type { ViewportProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: ViewportProps = $props();

	const listViewportState = useCommandViewport({
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
