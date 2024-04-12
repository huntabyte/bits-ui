<script lang="ts">
	import { setAccordionRootState } from "../state.svelte.js";
	import type { AccordionRootProps } from "../types.js";

	let {
		disabled = false,
		forceVisible = false,
		asChild,
		children,
		child,
		type,
		value = $bindable(),
		el,
		...restProps
	}: AccordionRootProps = $props();

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

{#if asChild}
	{@render child?.(restProps)}
{:else}
	<div bind:this={el} {...restProps}>
		{@render children?.()}
	</div>
{/if}
