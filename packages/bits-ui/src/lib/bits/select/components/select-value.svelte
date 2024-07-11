<script lang="ts">
	import type { ValueProps } from "../index.js";
	import { useSelectValue } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		placeholder = "",
		children,
		child,
		ref = $bindable(),
		...restProps
	}: ValueProps = $props();

	const valueState = useSelectValue();

	if (children) {
		valueState.root.valueNodeHasChildren.value = true;
	}

	const mergedProps = $derived(
		mergeProps(restProps, valueState.props, { style: { pointerEvents: "none" } })
	);
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps} bind:this={ref}>
		{#if valueState.showPlaceholder}
			{placeholder}
		{:else}
			{@render children?.()}
		{/if}
	</span>
{/if}
