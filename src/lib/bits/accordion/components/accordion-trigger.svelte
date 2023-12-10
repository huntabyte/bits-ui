<script lang="ts">
	import type { AccordionTriggerProps } from "./types.js";
	import {
		getAccordionItemContext,
		getAccordionRootContext
	} from "./state.svelte.js";

	let {
		disabled = false,
		asChild = false,
		onclick,
		onkeydown,
		el = null,
		...rest
	} = $props<AccordionTriggerProps>();

	const rootState = getAccordionRootContext();
	const itemState = getAccordionItemContext();
	const triggerState = itemState.createTrigger({
		el,
		disabled,
		onclick,
		onkeydown
	});

	let isDisabled = $derived(
		disabled || rootState.disabled || itemState.disabled
	);

	let attrs = $derived({
		disabled: isDisabled,
		"aria-expanded": itemState.isSelected ? true : false,
		"aria-disabled": disabled ? true : false,
		"data-disabled": isDisabled ? "" : undefined,
		"data-value": itemState.value,
		"data-state": itemState.isSelected ? "open" : "closed",
		"data-accordion-trigger": ""
	});
</script>

{#if asChild}
	<slot />
{:else}
	<button
		bind:this={el}
		type="button"
		{...attrs}
		{...rest}
		onclick={triggerState.onclick}
		onkeydown={triggerState.onkeydown}
	>
		<slot />
	</button>
{/if}
