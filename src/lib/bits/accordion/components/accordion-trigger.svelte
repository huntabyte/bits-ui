<script lang="ts">
	import type { AccordionTriggerProps } from "./types.js";
	import {
		getAccordionItemContext,
		getAccordionRootContext
	} from "./state.svelte.js";

	let {
		disabled = false,
		asChild = false,
		el = null,
		onkeydown = undefined,
		onclick = undefined,
		...props
	} = $props<AccordionTriggerProps>();

	const rootState = getAccordionRootContext();
	const itemState = getAccordionItemContext();
	const triggerState = itemState.createTrigger({
		el,
		disabled,
		onkeydown,
		onclick
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

	$effect(() => {
		triggerState.disabled = disabled;
		triggerState.el = el;
		triggerState.handlers.click = onclick;
		triggerState.handlers.keydown = onkeydown;
	});
</script>

{#if asChild}
	<slot />
{:else}
	<button
		bind:this={el}
		type="button"
		{...attrs}
		{...props}
		onclick={triggerState.onclick}
		onkeydown={triggerState.onkeydown}
	>
		<slot />
	</button>
{/if}
