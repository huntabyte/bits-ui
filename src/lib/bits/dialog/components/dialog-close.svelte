<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { CloseEvents, CloseProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CloseProps;
	type $$Events = CloseEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { close }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("close");

	$: builder = $close;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
