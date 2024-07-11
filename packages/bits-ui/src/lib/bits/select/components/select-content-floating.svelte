<script lang="ts">
	import { CONTENT_MARGIN, useSelectFloatingPosition } from "../select.svelte.js";
	import type { ContentProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import type { WithoutChildren } from "$lib/shared/index.js";
	import type { WithChild } from "$lib/internal/types.js";
	import type { PopperLayerImplProps } from "$lib/bits/utilities/popper-layer/types.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";

	let {
		children,
		child,
		align = "start",
		collisionPadding = CONTENT_MARGIN,
		enabled = false,
		...restProps
	}: WithoutChildren<PopperLayerImplProps> &
		WithChild<ContentProps> & { enabled: boolean } = $props();

	const contentFloatingState = useSelectFloatingPosition();

	const mergedProps = $derived(
		mergeProps(restProps, contentFloatingState.content.props, contentFloatingState.props)
	);
</script>

<FloatingLayer.Content {...restProps} {enabled} {align} {collisionPadding}>
	{#snippet content({ props })}
		{@const finalProps = mergeProps(props, mergedProps)}
		{#if child}
			{@render child?.({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</FloatingLayer.Content>
