<script lang="ts">
	import { getAccordionValue } from "./helpers.js";
	import { setAccordionRootContext } from "./state.svelte.js";
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

	let value = rest.value ?? getAccordionValue(type);

	let root = $state<AccordionRootContext>({
		value,
		disabled,
		forceVisible,
		el: null
	});

	$effect(() => {
		root.disabled = disabled;
		root.forceVisible = forceVisible;
	});

	setAccordionRootContext(root);
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
