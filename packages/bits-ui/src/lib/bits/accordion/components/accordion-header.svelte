<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { AccordionHeaderProps } from "../types.js";
	import { useAccordionHeader } from "../accordion.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		level = 2,
		children,
		child,
		ref = $bindable(),
		...restProps
	}: AccordionHeaderProps = $props();

	const headerState = useAccordionHeader({
		level: box.with(() => level),
	});

	const mergedProps = $derived(mergeProps(restProps, headerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
