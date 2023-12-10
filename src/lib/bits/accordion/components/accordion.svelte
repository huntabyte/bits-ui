<script lang="ts">
	import { initAccordionState } from "./helpers.js";
	import { setAccordionRootContext } from "./state.svelte.js";
	import type { AccordionRootProps } from "./types.js";

	let {
		disabled = false,
		forceVisible = false,
		asChild = false,
		children,
		type,
		value = undefined,
		...props
	} = $props<AccordionRootProps>();

	const rootState = initAccordionState({ type, value });
	setAccordionRootContext(rootState);

	$effect(() => {
		rootState.disabled = disabled;
		rootState.forceVisible = forceVisible;
	});
</script>

{#if asChild && children}
	{@render children()}
{:else}
	<div bind:this={rootState.el} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
