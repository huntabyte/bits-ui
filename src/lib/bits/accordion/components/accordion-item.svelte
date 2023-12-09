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

	const root = getContext<AccordionRootContext>("ACCORDION");

	const itemCtx = $state({ value, disabled });

	setContext<AccordionItemContext>("ACCORDION_ITEM", itemCtx);

	let isDisabled = $derived(disabled || root.disabled);
	let isSelected = $derived(getIsSelected());

	function getIsSelected() {
		if (root.value.isMulti) {
			return root.value.value.includes(itemCtx.value);
		} else {
			return root.value.value === itemCtx.value;
		}
	}

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
