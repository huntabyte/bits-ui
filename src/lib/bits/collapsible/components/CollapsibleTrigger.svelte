<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/events.js";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let asChild: $$Props["asChild"] = false;
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
	<button use:melt={builder} type="button" {...$$restProps} {...attrs} on:m-click={dispatch}>
		<slot {builder} {attrs} />
	</button>
{/if}
