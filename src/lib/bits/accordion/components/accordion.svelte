<script lang="ts">
	import { setAccordionRootState } from "../state.svelte.js";
	import type { AccordionRootProps } from "../types.js";

	let {
		disabled = false,
		forceVisible = false,
		asChild = false,
		children,
		child,
		type,
		value,
		el,
		...props
	} = $props<AccordionRootProps>();

	const rootState = setAccordionRootState({ type, value });

	$effect.pre(() => {
		if (value !== undefined) {
			rootState.value = value;
		}
	});
	$effect.pre(() => {
		value = rootState.value;
	});
	$effect.pre(() => {
		rootState.el = el;
	});
	$effect.pre(() => {
		rootState.disabled = disabled;
	});
	$effect.pre(() => {
		rootState.forceVisible = forceVisible;
	});
</script>

{#if asChild && child}
	{@render child(props)}
{:else}
	<div bind:this={el} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
