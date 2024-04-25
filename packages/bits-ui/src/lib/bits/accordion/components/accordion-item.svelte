<script lang="ts">
	import { box } from "runed";
	import type { AccordionItemProps } from "../types.js";
	import { useAccordionItem } from "../accordion.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	let {
		asChild,
		disabled = false,
		value,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionItemProps = $props();

	const state = useAccordionItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled),
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
