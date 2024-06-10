<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useFloatingContentState } from "../useFloatingLayer.svelte.js";
	import type { ContentImplProps } from "./index.js";
	import { mergeProps, useId } from "$lib/internal/index.js";
	import { useBodyScrollLock } from "$lib/internal/useBodyScrollLock.svelte.js";

	let {
		content,
		side = "bottom",
		sideOffset = 0,
		align = "center",
		alignOffset = 0,
		id,
		arrowPadding = 0,
		avoidCollisions = true,
		collisionBoundary = [],
		collisionPadding = 0,
		hideWhenDetached = false,
		onPlaced = () => {},
		sticky = "partial",
		updatePositionStrategy = "optimized",
		strategy = "fixed",
		dir = "ltr",
		style = {},
		enabled,
		wrapperId = useId(),
		preventScroll = true,
	}: ContentImplProps = $props();

	const state = useFloatingContentState({
		side: box.with(() => side),
		sideOffset: box.with(() => sideOffset),
		align: box.with(() => align),
		alignOffset: box.with(() => alignOffset),
		id: box.with(() => id),
		arrowPadding: box.with(() => arrowPadding),
		avoidCollisions: box.with(() => avoidCollisions),
		collisionBoundary: box.with(() => collisionBoundary),
		collisionPadding: box.with(() => collisionPadding),
		hideWhenDetached: box.with(() => hideWhenDetached),
		onPlaced: box.with(() => onPlaced),
		sticky: box.with(() => sticky),
		updatePositionStrategy: box.with(() => updatePositionStrategy),
		strategy: box.with(() => strategy),
		dir: box.with(() => dir),
		style: box.with(() => style),
		enabled: box.with(() => enabled),
		wrapperId: box.with(() => wrapperId),
	});

	const mergedProps = $derived(
		mergeProps(state.wrapperProps, {
			style: {
				pointerEvents: "auto",
			},
		})
	);

	useBodyScrollLock(preventScroll);
</script>

<div {...mergedProps}>
	{@render content?.({ props: state.props })}
</div>
