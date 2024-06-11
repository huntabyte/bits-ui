<script lang="ts">
	import { box } from "svelte-toolbelt";
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

	const itemState = useAccordionItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
