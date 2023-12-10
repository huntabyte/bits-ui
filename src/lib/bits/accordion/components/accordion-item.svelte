<script lang="ts">
	import type { AccordionItemProps } from "./types.js";
	import {
		AccordionItemState,
		getAccordionRootContext,
		setAccordionItemContext
	} from "./state.svelte.js";
	let {
		asChild = false,
		disabled = false,
		value,
		children,
		...rest
	} = $props<AccordionItemProps>();

	const rootState = getAccordionRootContext();
	const itemState = new AccordionItemState({ value, disabled, rootState });

	setAccordionItemContext(itemState);

	let isDisabled = $derived(disabled || rootState.disabled);

	$effect(() => {
		itemState.disabled = disabled;
		itemState.value = value;
	});

	let attrs = $derived({
		"data-state": itemState.isSelected ? "open" : "closed",
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
