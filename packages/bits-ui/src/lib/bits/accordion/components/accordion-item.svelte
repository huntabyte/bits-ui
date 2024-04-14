<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { setAccordionItemState } from "../accordion.svelte.js";
	import { box } from "$lib/internal/box.svelte.js";
	let {
		asChild,
		disabled: disabledProp = false,
		value: valueProp,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionItemProps = $props();

	const disabled = box(() => disabledProp);
	const value = box(() => valueProp);

	const item = setAccordionItemState({ value, disabled });

	const isDisabled = $derived(disabled || item.root.disabled);

	const mergedProps = $derived({
		...restProps,
		...item.props,
		"data-state": item.isSelected ? "open" : "closed",
		"data-disabled": isDisabled ? "" : undefined,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
