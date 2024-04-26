<script lang="ts">
	import { box } from "runed";
	import type { AccordionHeaderProps } from "../types.js";
	import { useAccordionHeader } from "../accordion.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		level = 2,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionHeaderProps = $props();

	const state = useAccordionHeader({
		level: box.with(() => level),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
