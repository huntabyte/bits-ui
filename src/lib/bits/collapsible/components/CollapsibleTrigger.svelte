<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/events.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
	const dispatch = createDispatcher();
	$: builder = $trigger;
	const attrs = ctx.getAttrs("trigger");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button use:melt={builder} {...$$restProps} on:m-click={dispatch} {...attrs}>
		<slot {builder} {attrs} />
	</button>
{/if}
