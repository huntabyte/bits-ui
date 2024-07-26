<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useSelectItemAlignedPosition } from "../select.svelte.js";
	import type { WithChild } from "$lib/internal/types.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useBodyScrollLock } from "$lib/internal/useBodyScrollLock.svelte.js";
	import type { PrimitiveDivAttributes } from "$lib/shared/attributes.js";

	let {
		child,
		children,
		preventScroll = true,
		onPlaced,
		...restProps
	}: WithChild<PrimitiveDivAttributes> & {
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
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</div>
