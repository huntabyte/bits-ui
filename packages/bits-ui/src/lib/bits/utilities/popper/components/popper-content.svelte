<script lang="ts">
	import type { ContentProps } from "../index.js";
	import { setPopperContentState } from "../popper.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		children,
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
	}: ContentProps = $props();

	setPopperContentState({
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
	});
</script>

{@render children?.()}
