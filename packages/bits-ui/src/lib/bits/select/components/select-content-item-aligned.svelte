<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSelectItemAlignedPosition } from "../select.svelte.js";
	import type { PrimitiveDivAttributes, WithAsChild } from "$lib/internal/types.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		child,
		children,
		asChild,
		el = $bindable(),
		...restProps
	}: WithAsChild<PrimitiveDivAttributes> = $props();

	const state = useSelectItemAlignedPosition({
		onPlaced: box.with(() => () => {}),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
	const mergedWrapperProps = $derived(mergeProps(state.wrapperProps, {}));
</script>

<div {...mergedWrapperProps}>
	{#if asChild}
		{@render child?.({ props: mergedProps })}
	{:else}
		<div bind:this={el} {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
