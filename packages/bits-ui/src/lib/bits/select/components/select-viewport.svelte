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
	:global([data-bits-select-viewport]) {
		scrollbar-width: none;
		-ms-overflow-style: none;
		-webkit-overflow-scrolling: touch;
	}
	:global([data-bits-select-viewport])::-webkit-scrollbar {
		display: none;
	}
</style>
