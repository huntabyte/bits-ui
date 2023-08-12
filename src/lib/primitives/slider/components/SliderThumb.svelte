<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ThumbEvents, ThumbProps } from "../types.js";

	type $$Props = ThumbProps;
	type $$Events = ThumbEvents;
	const {
		elements: { thumb }
	} = ctx.get();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melts builders -->
<span use:melt={$thumb()} {...$$restProps} on:m-keydown on:keydown on:click />
