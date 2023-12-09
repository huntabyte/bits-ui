<script lang="ts">
	import { AccordionValue } from "./state.svelte.js";
	import type { AccordionRootProps, AccordionRootContext } from "./types.js";
	import { setContext } from "svelte";

	let {
		disabled = false,
		forceVisible = false,
		onValueChange = undefined,
		asChild = false,
		children,
		value = new AccordionValue(),
		...rest
	} = $props<AccordionRootProps>();

	let ctxState = $state<AccordionRootContext>({
		value,
		disabled,
		forceVisible,
		onValueChange,
		el: null
	});

	$effect(() => {
		onValueChange?.(value.value);
	});

	setContext<AccordionRootContext>("ACCORDION", ctxState);
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<div bind:this={ctxState.el} {...rest}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
