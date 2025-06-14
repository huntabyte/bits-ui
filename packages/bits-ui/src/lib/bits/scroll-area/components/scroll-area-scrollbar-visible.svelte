<script lang="ts">
	import { ScrollAreaScrollbarVisibleState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarX from "./scroll-area-scrollbar-x.svelte";
	import ScrollAreaScrollbarY from "./scroll-area-scrollbar-y.svelte";

	let { ...restProps }: Omit<_ScrollbarStubProps, "forceMount"> = $props();

	const scrollbarVisibleState = ScrollAreaScrollbarVisibleState.create();
</script>

{#if scrollbarVisibleState.scrollbar.opts.orientation.current === "horizontal"}
	<ScrollAreaScrollbarX {...restProps} />
{:else}
	<ScrollAreaScrollbarY {...restProps} />
{/if}
