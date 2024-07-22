<script lang="ts">
	import type { CornerProps } from "../index.js";
	import { getScrollAreaRootContext } from "../scroll-area.svelte.js";
	import ScrollAreaCornerImpl from "./scroll-area-corner-impl.svelte";
	import { useId } from "$lib/internal/useId.svelte.js";

	let { ref = $bindable(null), id = useId(), ...restProps }: CornerProps = $props();

	const scrollAreaState = getScrollAreaRootContext();

	const hasBothScrollbarsVisible = $derived(
		Boolean(scrollAreaState.scrollbarXNode && scrollAreaState.scrollbarYNode)
	);
	const hasCorner = $derived(scrollAreaState.type.value !== "scroll" && hasBothScrollbarsVisible);
</script>

{#if hasCorner}
	<ScrollAreaCornerImpl {...restProps} {id} bind:ref />
{/if}
