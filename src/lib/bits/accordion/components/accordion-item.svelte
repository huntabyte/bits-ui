<script lang="ts">
	import { getContext, setContext } from "svelte";
	import type {
		AccordionRootContext,
		AccordionItemContext,
		AccordionItemProps
	} from "./types.js";
	let {
		asChild = false,
		disabled = false,
		value,
		children,
		...rest
	} = $props<AccordionItemProps>();

	const ctx = getContext<AccordionRootContext>("ACCORDION");
	const itemCtx = $state({ value, disabled });

	setContext<AccordionItemContext>("ACCORDION_ITEM", itemCtx);

	let isDisabled = $derived(disabled || ctx.disabled);
	let isSelected = $derived(ctx.value.value === value);

	let attrs = $derived({
		"data-state": isSelected ? "open" : "closed",
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
