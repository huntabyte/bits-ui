<script lang="ts">
	import { useScrollAreaScrollbarX } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarShared from "./scroll-area-scrollbar-shared.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarXState = useScrollAreaScrollbarX();

	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props));
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
