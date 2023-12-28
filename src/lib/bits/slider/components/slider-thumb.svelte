<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ThumbEvents, ThumbProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ThumbProps;
	type $$Events = ThumbEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { thumb }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("thumb");

	$: builder = $thumb();
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
	/>
{/if}
