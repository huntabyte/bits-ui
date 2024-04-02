<script lang="ts">
	import type { ThumbProps } from "../index.js";
	import { getScrollbarOrientation } from "../ctx.js";
	import ScrollAreaThumbY from "./scroll-area-thumb-y.svelte";
	import ScrollAreaThumbX from "./scroll-area-thumb-x.svelte";

	type $$Props = ThumbProps;

	const orientation = getScrollbarOrientation();
</script>

{#if $orientation === "vertical"}
	<ScrollAreaThumbY {...$$restProps} let:builder>
		<slot {builder} />
	</ScrollAreaThumbY>
{:else}
	<ScrollAreaThumbX {...$$restProps} let:builder>
		<slot {builder} />
	</ScrollAreaThumbX>
{/if}
