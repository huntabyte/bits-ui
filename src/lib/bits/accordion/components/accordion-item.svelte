<script lang="ts">
	import type { AccordionItemProps } from "./types.js";
	import {
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

	const root = getAccordionRootContext();
	const itemCtx = $state({ value, disabled });

	setAccordionItemContext(itemCtx);

	let isDisabled = $derived(disabled || root.disabled);
	let isSelected = $derived(getIsSelected());

	function getIsSelected() {
		if (root.value.isMulti) {
			return root.value.value.includes(itemCtx.value);
		} else {
			return root.value.value === itemCtx.value;
		}
	}

	$effect(() => {
		itemCtx.disabled = disabled;
		itemCtx.value = value;
	});

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
