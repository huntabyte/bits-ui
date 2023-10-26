<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ThumbEvents, ThumbProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ThumbProps;
	type $$Events = ThumbEvents;
	export let asChild = false;
	const thumb = ctx.get().elements.thumb;
	const dispatch = createDispatcher();
	$: builder = $thumb();
	const attrs = ctx.getAttrs("thumb");
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs} on:m-keydown={dispatch} />
{/if}
