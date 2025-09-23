<script lang="ts">
	import { IsMounted } from "runed";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { ScrollAreaScrollbarXState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import ScrollAreaScrollbarShared from "./scroll-area-scrollbar-shared.svelte";

	let { ...restProps }: _ScrollbarStubProps = $props();

	const isMounted = new IsMounted();

	const scrollbarXState = ScrollAreaScrollbarXState.create({
		mounted: boxWith(() => isMounted.current),
	});
	// oxlint-disable-next-line no-explicit-any
	const mergedProps = $derived(mergeProps(restProps, scrollbarXState.props)) as any;
</script>

<ScrollAreaScrollbarShared {...mergedProps} />
