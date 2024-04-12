<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { setAccordionItemState } from "../state.svelte.js";
	let {
		asChild,
		disabled = false,
		value,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionItemProps = $props();

	const item = setAccordionItemState({ value, disabled });

	let isDisabled = $derived(disabled || item.root.disabled);

	$effect.pre(() => {
		item.disabled = disabled;
	});

	$effect.pre(() => {
		item.value = value;
	});

	const mergedProps = $derived({
		...restProps,
		...item.props,
		"data-state": item.isSelected ? "open" : "closed",
		"data-disabled": isDisabled ? "" : undefined,
	});
</script>

{#if asChild}
	{@render child?.(mergedProps)}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
