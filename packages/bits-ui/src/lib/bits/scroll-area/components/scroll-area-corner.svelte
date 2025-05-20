<script lang="ts">
	import type { ScrollAreaCornerProps } from "../types.js";
	import { ScrollAreaRootContext } from "../scroll-area.svelte.js";
	import ScrollAreaCornerImpl from "./scroll-area-corner-impl.svelte";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: ScrollAreaCornerProps = $props();

	const scrollAreaState = ScrollAreaRootContext.get();

	const hasBothScrollbarsVisible = $derived(
		Boolean(scrollAreaState.scrollbarXNode && scrollAreaState.scrollbarYNode)
	);
	const hasCorner = $derived(
		scrollAreaState.opts.type.current !== "scroll" && hasBothScrollbarsVisible
	);
</script>

{#if hasCorner}
	<ScrollAreaCornerImpl {...restProps} {id} bind:ref />
{/if}
