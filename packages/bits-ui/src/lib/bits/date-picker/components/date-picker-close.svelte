<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { CloseEvents, CloseProps } from "../index.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CloseProps;
	type $$Events = CloseEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { close },
		getPopoverAttrs,
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
		bind:this={ref}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
