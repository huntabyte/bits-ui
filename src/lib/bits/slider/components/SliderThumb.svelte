<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ThumbEvents, ThumbProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ThumbProps;
	type $$Events = ThumbEvents;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { thumb }
	} = getCtx();
	const dispatch = createDispatcher();
	$: builder = $thumb();
	const attrs = getAttrs("thumb");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs} on:m-keydown={dispatch} />
{/if}
