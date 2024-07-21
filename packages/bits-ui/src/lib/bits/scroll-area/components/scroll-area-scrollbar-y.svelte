<script lang="ts">
	import { useScrollAreaScrollbarY } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarShared from "./scroll-area-scrollbar-shared.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarXState = useScrollAreaScrollbarY();

	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props));
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
