<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ViewportProps } from "../index.js";
	import { useSelectViewport } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		children,
		child,
		...restProps
	}: ViewportProps = $props();

	const state = useSelectViewport({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<style>
	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */
	:global([data-select-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}
	:global([data-select-viewport])::-webkit-scrollbar {
		display: none !important;
	}
</style>
