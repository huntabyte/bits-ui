<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { CancelEvents, CancelProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CancelProps;
	type $$Events = CancelEvents;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { close }
	} = getCtx();

	const dispatch = createDispatcher();
	$: builder = $close;
	const attrs = getAttrs("cancel");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		type="button"
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
