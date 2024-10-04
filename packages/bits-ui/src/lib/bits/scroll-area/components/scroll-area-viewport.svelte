<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ScrollAreaViewportProps } from "../types.js";
	import { useScrollAreaViewport } from "../scroll-area.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		ref = $bindable(null),
		id = useId(),
		children,
		...restProps
	}: ScrollAreaViewportProps = $props();

	const viewportState = useScrollAreaViewport({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props));
	const mergedContentProps = $derived(mergeProps({}, viewportState.contentProps));
</script>

<div {...mergedProps}>
	<div {...mergedContentProps}>
		{@render children?.()}
	</div>
</div>

<style>
	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */
	:global([data-scroll-area-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}
	:global([data-scroll-area-viewport])::-webkit-scrollbar {
		display: none !important;
	}
</style>
