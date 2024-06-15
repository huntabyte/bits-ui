<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ViewportProps } from "../index.js";
	import { useNavigationMenuViewport } from "../navigation-menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(),
		asChild,
		children,
		child,
		...restProps
	}: ViewportProps = $props();

	const viewportState = useNavigationMenuViewport({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
