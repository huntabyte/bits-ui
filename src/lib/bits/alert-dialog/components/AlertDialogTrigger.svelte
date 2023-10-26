<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";
	import { ATTRS } from "../attrs.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
	const dispatch = createDispatcher();

	$: builder = $trigger;
	const attrs = ATTRS.trigger;
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
