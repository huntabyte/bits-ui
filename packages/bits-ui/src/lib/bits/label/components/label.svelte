<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setLabelRootState } from "../label.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		ref = $bindable(),
		for: forProp,
		...restProps
	}: RootProps = $props();

	const rootState = setLabelRootState();
	const mergedProps = $derived(mergeProps(restProps, rootState.props, { for: forProp }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<label bind:this={ref} {...mergedProps} for={forProp}>
		{@render children?.()}
	</label>
{/if}
