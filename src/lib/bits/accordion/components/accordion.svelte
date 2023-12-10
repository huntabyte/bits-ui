<script lang="ts">
	import { getAccordionValue } from "./helpers.js";
	import { setAccordionRootContext } from "./state.svelte.js";
	import type { AccordionRootProps, AccordionRootContext } from "./types.js";

	let {
		disabled = false,
		forceVisible = false,
		asChild = false,
		children,
		type,
		value = undefined,
		...props
	} = $props<AccordionRootProps & { v: string }>();

	let localValue = value ?? getAccordionValue(type);

	let root = $state<AccordionRootContext>({
		value: localValue,
		disabled,
		forceVisible,
		el: null
	});

	$effect(() => {
		root.disabled = disabled;
		root.forceVisible = forceVisible;
	});

	// eslint-disable-next-line svelte/valid-compile
	setAccordionRootContext(root);
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<div bind:this={root.el} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
