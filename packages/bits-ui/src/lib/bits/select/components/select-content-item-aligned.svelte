<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSelectItemAlignedPosition } from "../select.svelte.js";
	import type { PrimitiveDivAttributes, WithAsChild } from "$lib/internal/types.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useBodyScrollLock } from "$lib/internal/useBodyScrollLock.svelte.js";

	let {
		child,
		children,
		asChild,
		el = $bindable(),
		preventScroll = true,
		onPlaced,
		...restProps
	}: WithAsChild<PrimitiveDivAttributes> & {
		preventScroll?: boolean;
		onPlaced: () => void;
	} = $props();

	const contentItemAlignedState = useSelectItemAlignedPosition({
		onPlaced: box.with(() => onPlaced),
	});

	const mergedProps = $derived(mergeProps(restProps, contentItemAlignedState.props));
	const mergedWrapperProps = $derived(mergeProps(contentItemAlignedState.wrapperProps, {}));

	useBodyScrollLock(preventScroll);
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
