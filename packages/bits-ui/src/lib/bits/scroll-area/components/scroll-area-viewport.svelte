<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { ScrollAreaViewportProps } from "../types.js";
	import { ScrollAreaViewportState } from "../scroll-area.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		children,
		style,
		...restProps
	}: ScrollAreaViewportProps = $props();

	const viewportState = ScrollAreaViewportState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, viewportState.props, { style }));
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

	:global(:where([data-scroll-area-viewport])) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}
	:global(:where([data-scroll-area-content])) {
		flex-grow: 1;
	}
</style>
