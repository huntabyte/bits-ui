<script lang="ts">
	import {
		useScrollAreaScrollbarAuto,
		useScrollAreaScrollbarHover,
	} from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarHoverState = useScrollAreaScrollbarHover();
	const scrollbarAutoState = useScrollAreaScrollbarAuto();
	const mergedProps = $derived(
		mergeProps(restProps, scrollbarHoverState.props, scrollbarAutoState.props, {
			"data-state": scrollbarHoverState.isVisible ? "visible" : "hidden",
		})
	);

	const present = $derived(
		forceMount || (scrollbarHoverState.isVisible && scrollbarAutoState.isVisible)
	);
</script>

<PresenceLayer {...mergedProps} {present}>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
