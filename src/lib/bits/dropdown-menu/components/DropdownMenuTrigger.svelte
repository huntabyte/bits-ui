<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = getCtx();
	const dispatch = createDispatcher();

	$: builder = $trigger;
	const attrs = getAttrs("trigger");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
