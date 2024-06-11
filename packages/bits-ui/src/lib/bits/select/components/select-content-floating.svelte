<script lang="ts">
	import { CONTENT_MARGIN, useSelectFloatingPosition } from "../select.svelte.js";
	import type { ContentProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import type { WithoutChildren } from "$lib/shared/index.js";
	import type { WithAsChild } from "$lib/internal/types.js";
	import type { PopperLayerImplProps } from "$lib/bits/utilities/popper-layer/types.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		children,
		asChild,
		child,
		align = "start",
		collisionPadding = CONTENT_MARGIN,
		el = $bindable(),
		enabled = false,
		...restProps
	}: WithoutChildren<PopperLayerImplProps> &
		WithAsChild<ContentProps> & { enabled: boolean } = $props();

	const contentFloatingState = useSelectFloatingPosition();

	const mergedProps = $derived(
		mergeProps(restProps, contentFloatingState.content.props, contentFloatingState.props)
	);
</script>

<FloatingLayer.Content {...restProps} {enabled} {align} {collisionPadding}>
	{#snippet content({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if asChild}
			{@render child?.({ props: finalProps })}
		{:else}
			<div {...finalProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</FloatingLayer.Content>
