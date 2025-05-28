<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { useScrollAreaScrollbarScroll } from "../scroll-area.svelte.js";
	import type { ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: ScrollbarStubProps = $props();

	const scrollbarScrollState = useScrollAreaScrollbarScroll();

	const mergedProps = $derived(mergeProps(restProps, scrollbarScrollState.props));
</script>

<PresenceLayer
	{...mergedProps}
	present={forceMount || !scrollbarScrollState.isHidden}
	ref={scrollbarScrollState.scrollbar.opts.ref}
>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
