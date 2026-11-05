<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { boxWith } from "#lib/internal/box.svelte.js";
	import { untrack } from "svelte";
	import { FloatingContentState } from "../use-floating-layer.svelte.js";
	import type { ContentImplProps } from "./index.js";
	import { useId } from "#lib/internal/use-id.js";

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
		wrapperId = useId(),
		customAnchor = null,
		enabled,
		tooltip = false,
	}: ContentImplProps = $props();

	const contentState = FloatingContentState.create(
		{
			side: boxWith(() => side),
			sideOffset: boxWith(() => sideOffset),
			align: boxWith(() => align),
			alignOffset: boxWith(() => alignOffset),
			id: boxWith(() => id),
			arrowPadding: boxWith(() => arrowPadding),
			avoidCollisions: boxWith(() => avoidCollisions),
			collisionBoundary: boxWith(() => collisionBoundary),
			collisionPadding: boxWith(() => collisionPadding),
			hideWhenDetached: boxWith(() => hideWhenDetached),
			onPlaced: boxWith(() => onPlaced),
			sticky: boxWith(() => sticky),
			updatePositionStrategy: boxWith(() => updatePositionStrategy),
			strategy: boxWith(() => strategy),
			dir: boxWith(() => dir),
			style: boxWith(() => style),
			enabled: boxWith(() => enabled),
			wrapperId: boxWith(() => wrapperId),
			customAnchor: boxWith(() => customAnchor),
		},
		untrack(() => tooltip)
	);

	const mergedProps = $derived(
		mergeProps(contentState.wrapperProps, {
			style: {
				pointerEvents: "auto",
			},
		})
	);

	// A snippet argument is re-evaluated as a whole, so a plain `{ props, wrapperProps }`
	// would make everything reading `props` also re-run on every `wrapperProps` (position)
	// update. Getters keep the two dependencies separate.
	const snippetProps = {
		get props() {
			return contentState.props;
		},
		get wrapperProps() {
			return mergedProps;
		},
	};
</script>

{@render content?.(snippetProps)}
