<script lang="ts">
	import type { ValueProps } from "../index.js";
	import { useSelectValue } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		placeholder = "",
		asChild,
		children,
		child,
		el = $bindable(),
		...restProps
	}: ValueProps = $props();

	const state = useSelectValue();

	if (children) {
		state.root.valueNodeHasChildren.value = true;
	}

	const mergedProps = $derived(
		mergeProps(restProps, state.props, { style: { pointerEvents: "none" } })
	);
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps} bind:this={el}>
		{#if state.showPlaceholder}
			{placeholder}
		{:else}
			{@render children?.()}
		{/if}
	</span>
{/if}
