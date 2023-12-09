<script lang="ts">
	import { AccordionMultiValue, AccordionValue } from "./state.svelte.js";
	import type { AccordionRootProps, AccordionRootContext } from "./types.js";
	import { setContext } from "svelte";

	let {
		disabled = false,
		forceVisible = false,
		asChild = false,
		children,
		type,
		...rest
	} = $props<AccordionRootProps>();

	function getAccordionValue() {
		return type === "single" ? new AccordionValue() : new AccordionMultiValue();
	}

	let value = rest.value ?? getAccordionValue();

	let root = $state<AccordionRootContext>({
		value,
		disabled,
		forceVisible,
		el: null
	});

	setContext<AccordionRootContext>("ACCORDION", root);
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<div bind:this={root.el} {...rest}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
