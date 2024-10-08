<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { CONTENT_MARGIN, useSelectFloatingPosition } from "../select.svelte.js";
	import type { SelectContentProps } from "../types.js";
	import type { WithoutChildrenOrChild } from "$lib/shared/index.js";
	import type { WithChild } from "$lib/internal/types.js";
	import FloatingLayerContent from "$lib/bits/utilities/floating-layer/components/floating-layer-content.svelte";
	import type { FloatingLayerContentImplProps } from "$lib/bits/utilities/floating-layer/types.js";
	import ScrollLock from "$lib/bits/utilities/scroll-lock/scroll-lock.svelte";

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
		WithChild<SelectContentProps> & { enabled: boolean } = $props();

	const contentFloatingState = useSelectFloatingPosition();

	const mergedProps = $derived(mergeProps(restProps, contentFloatingState.content.props));
</script>

<FloatingLayerContent
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
	{wrapperId}
	{onPlaced}
	{style}
>
	{#snippet content({ props })}
		<ScrollLock {preventScroll} />
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
</FloatingLayerContent>
