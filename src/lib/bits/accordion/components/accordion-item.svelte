<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { setAccordionItemState } from "../state.svelte.js";
	let {
		asChild = false,
		disabled = false,
		value,
		children,
		child,
		...props
	} = $props<AccordionItemProps>();

	const item = setAccordionItemState({ value, disabled });

	let isDisabled = $derived(disabled || item.root.disabled);

	$effect(() => {
		item.disabled = disabled;
		item.value = value;
	});

	let attrs = $derived({
		"data-state": item.isSelected ? "open" : "closed",
		"data-disabled": isDisabled ? "" : undefined,
	});
</script>

{#if asChild && child}
	{@render child({ ...props, ...attrs })}
{:else}
	<div {...attrs} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
