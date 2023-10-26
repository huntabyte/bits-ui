<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/events.js";
	import { ctx } from "../ctx.js";
	import type { ActionEvents, ActionProps } from "../types.js";

	type $$Props = ActionProps;
	type $$Events = ActionEvents;
	export let asChild = false;
	const {
		elements: { close }
	} = ctx.get();

	const dispatch = createDispatcher();

	$: builder = $close;
	const attrs = ctx.getAttrs("action");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
