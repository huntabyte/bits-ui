<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CancelEvents, CancelProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CancelProps;
	type $$Events = CancelEvents;
	export let asChild = false;
	const {
		elements: { close }
	} = ctx.get();

	const dispatch = createDispatcher();
	$: builder = $close;
	const attrs = ctx.getAttrs("cancel");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
		{...$$restProps}
		{...attrs}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
