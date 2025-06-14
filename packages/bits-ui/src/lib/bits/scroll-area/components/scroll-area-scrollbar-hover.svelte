<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import {
		useScrollAreaScrollbarAuto,
		useScrollAreaScrollbarHover,
	} from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarHoverState = useScrollAreaScrollbarHover();
	const scrollbarAutoState = useScrollAreaScrollbarAuto();
	const mergedProps = $derived(
		mergeProps(restProps, scrollbarHoverState.props, scrollbarAutoState.props, {
			"data-state": scrollbarHoverState.isVisible ? "visible" : "hidden",
		})
	);

	const open = $derived(
		forceMount || (scrollbarHoverState.isVisible && scrollbarAutoState.isVisible)
	);
</script>

<PresenceLayer {open} ref={scrollbarAutoState.scrollbar.opts.ref}>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
