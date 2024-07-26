<script lang="ts">
	import { CONTENT_MARGIN, useSelectFloatingPosition } from "../select.svelte.js";
	import type { ContentProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import type { WithoutChildrenOrChild } from "$lib/shared/index.js";
	import type { WithChild } from "$lib/internal/types.js";
	import { FloatingLayer } from "$lib/bits/utilities/floating-layer/index.js";
	import type { FloatingLayerContentImplProps } from "$lib/bits/utilities/floating-layer/types.js";

	let {
		children,
		child,
		align = "start",
		collisionPadding = CONTENT_MARGIN,
		side = "bottom",
		sideOffset = 0,
		alignOffset = 0,
		arrowPadding,
		avoidCollisions,
		collisionBoundary,
		sticky,
		hideWhenDetached,
		updatePositionStrategy,
		strategy,
		dir,
		preventScroll,
		wrapperId,
		style,
		onPlaced,
		id,
		...restProps
	}: WithoutChildrenOrChild<FloatingLayerContentImplProps> &
		WithChild<ContentProps> & { enabled: boolean } = $props();

	const contentFloatingState = useSelectFloatingPosition();

	const mergedProps = $derived(mergeProps(restProps, contentFloatingState.content.props));
</script>

<FloatingLayer.Content
	{id}
	{side}
	{sideOffset}
	{arrowPadding}
	{alignOffset}
	{collisionPadding}
	{align}
	{collisionBoundary}
	{avoidCollisions}
	{sticky}
	{hideWhenDetached}
	{updatePositionStrategy}
	{strategy}
	{dir}
	{preventScroll}
	{wrapperId}
	{onPlaced}
	{style}
>
	{#snippet content({ props })}
		{@const finalProps = mergeProps(props, mergedProps, {
			style: contentFloatingState.props.style,
		})}
		{#if child}
			{@render child({ props: finalProps })}
		{:else}
			<div {...finalProps}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</FloatingLayer.Content>
