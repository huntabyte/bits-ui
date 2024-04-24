<script lang="ts">
	import { setFloatingContentState } from "../floating-layer.svelte.js";
	import type { ContentProps } from "./index.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";
	import { useBodyScrollLock } from "$lib/internal/useBodyScrollLock.svelte.js";

	let {
		content,
		side = "bottom",
		sideOffset = 0,
		align = "center",
		alignOffset = 0,
		id = useId(),
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
		present,
		wrapperId = useId(),
	}: ContentProps = $props();

	const state = setFloatingContentState({
		side: readonlyBox(() => side),
		sideOffset: readonlyBox(() => sideOffset),
		align: readonlyBox(() => align),
		alignOffset: readonlyBox(() => alignOffset),
		id: readonlyBox(() => id),
		arrowPadding: readonlyBox(() => arrowPadding),
		avoidCollisions: readonlyBox(() => avoidCollisions),
		collisionBoundary: readonlyBox(() => collisionBoundary),
		collisionPadding: readonlyBox(() => collisionPadding),
		hideWhenDetached: readonlyBox(() => hideWhenDetached),
		onPlaced: readonlyBox(() => onPlaced),
		sticky: readonlyBox(() => sticky),
		updatePositionStrategy: readonlyBox(() => updatePositionStrategy),
		strategy: readonlyBox(() => strategy),
		dir: readonlyBox(() => dir),
		style: readonlyBox(() => style),
		present: readonlyBox(() => present),
		wrapperId: readonlyBox(() => wrapperId),
	});

	const mergedProps = $derived(mergeProps(state.wrapperProps));

	useBodyScrollLock(true);
</script>

<div {...mergedProps}>
	{@render content?.({ props: state.props })}
</div>
