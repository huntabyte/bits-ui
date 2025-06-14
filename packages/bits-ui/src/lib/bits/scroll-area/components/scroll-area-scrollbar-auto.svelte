<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { ScrollAreaScrollbarAutoState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarAutoState = ScrollAreaScrollbarAutoState.create();
	const mergedProps = $derived(mergeProps(restProps, scrollbarAutoState.props));
</script>

<PresenceLayer
	open={forceMount || scrollbarAutoState.isVisible}
	ref={scrollbarAutoState.scrollbar.opts.ref}
>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
