<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { PrevButtonEvents, PrevButtonProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = PrevButtonProps;
	type $$Events = PrevButtonEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { prevButton }
	} = getCtx();

	const attrs = getAttrs("prev-button");
	const dispatch = createDispatcher();

	$: builder = $prevButton;
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
	>
		<slot {builder} />
	</button>
{/if}
