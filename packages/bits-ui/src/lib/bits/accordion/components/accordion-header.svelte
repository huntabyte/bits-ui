<script lang="ts">
	import type { AccordionHeaderProps } from "../types.js";
	import { getAccordionHeaderState } from "../accordion.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		asChild,
		level = 2,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionHeaderProps = $props();

	const state = getAccordionHeaderState({
		level: readonlyBox(() => level),
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
