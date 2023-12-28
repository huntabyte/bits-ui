<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getPopoverAttrs } from "../ctx.js";
	import type { CloseProps, CloseEvents } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CloseProps;
	type $$Events = CloseEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { close }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getPopoverAttrs("close");

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
