<script lang="ts">
	import { useScrollAreaScrollbarVisible } from "../scroll-area.svelte.js";
	import type { ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarX from "./scroll-area-scrollbar-x.svelte";
	import ScrollAreaScrollbarY from "./scroll-area-scrollbar-y.svelte";

	let { ...restProps }: Omit<ScrollbarStubProps, "forceMount"> = $props();

	const scrollbarVisibleState = useScrollAreaScrollbarVisible();
</script>

{#if scrollbarVisibleState.scrollbar.opts.orientation.current === "horizontal"}
	<ScrollAreaScrollbarX {...restProps} />
{:else}
	<ScrollAreaScrollbarY {...restProps} />
{/if}
