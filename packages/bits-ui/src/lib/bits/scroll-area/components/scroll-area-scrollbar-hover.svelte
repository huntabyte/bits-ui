<script lang="ts">
	import { useScrollAreaScrollbarHover } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarAuto from "./scroll-area-scrollbar-auto.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarHoverState = useScrollAreaScrollbarHover();
	const mergedProps = $derived(mergeProps(restProps, scrollbarHoverState.props));
</script>

<PresenceLayer present={forceMount || scrollbarHoverState.isVisible} {...mergedProps}>
	{#snippet presence()}
		<ScrollAreaScrollbarAuto {...mergedProps} />
	{/snippet}
</PresenceLayer>
