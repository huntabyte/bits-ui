<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { useAccordionItem } from "../accordion.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
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
		value: readonlyBox(() => value),
		disabled: readonlyBox(() => disabled),
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
