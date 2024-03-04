<script lang="ts">
	import type { ScrollbarProps } from "../types.js";
	import { setScrollbarOrientation } from "../ctx.js";
	import { writable } from "svelte/store";
	import ScrollAreaScrollbarY from "./scroll-area-scrollbar-y.svelte";
	import ScrollAreaScrollbarX from "./scroll-area-scrollbar-x.svelte";

	type $$Props = ScrollbarProps;

	export let orientation: $$Props["orientation"];
	const orientationStore = writable(orientation);

	setScrollbarOrientation(orientationStore);

	$: orientationStore.set(orientation);
</script>

{#if $orientationStore === "vertical"}
	<ScrollAreaScrollbarY {...$$restProps} let:builder>
		<slot {builder} />
	</ScrollAreaScrollbarY>
{:else}
	<ScrollAreaScrollbarX {...$$restProps} let:builder>
		<slot {builder} />
	</ScrollAreaScrollbarX>
{/if}
