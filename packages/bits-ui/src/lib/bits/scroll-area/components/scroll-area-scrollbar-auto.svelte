<script lang="ts">
	import { useScrollAreaScrollbarAuto } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarVisible from "./scroll-area-scrollbar-visible.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import PresenceLayer from "$lib/bits/utilities/presence-layer/presence-layer.svelte";

	let { forceMount = false, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarAutoState = useScrollAreaScrollbarAuto();
	const mergedProps = $derived(mergeProps(restProps, scrollbarAutoState.props));
</script>

<PresenceLayer present={forceMount || scrollbarAutoState.isVisible} {...mergedProps}>
	{#snippet presence()}
		<ScrollAreaScrollbarVisible {...mergedProps} />
	{/snippet}
</PresenceLayer>
