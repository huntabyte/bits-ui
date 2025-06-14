<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { ScrollAreaScrollbarScrollState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarScrollState = ScrollAreaScrollbarScrollState.create();

	const mergedProps = $derived(mergeProps(restProps, scrollbarScrollState.props));
</script>

<PresenceLayer
	{...mergedProps}
	open={forceMount || !scrollbarScrollState.isHidden}
	ref={scrollbarScrollState.scrollbar.opts.ref}
>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
