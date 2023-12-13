<script lang="ts">
	import type { AccordionItemProps } from "./types.js";
	import { setAccordionItemState } from "./state.svelte.js";
	let {
		asChild = false,
		disabled = false,
		value,
		children,
		...rest
	} = $props<AccordionItemProps>();

	const item = setAccordionItemState({ value, disabled });

	let isDisabled = $derived(disabled || item.root.disabled);

	$effect(() => {
		item.disabled = disabled;
		item.value = value;
	});

	let attrs = $derived({
		"data-state": item.isSelected ? "open" : "closed",
		"data-disabled": isDisabled ? "" : undefined
	});
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<div {...attrs} {...rest}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
