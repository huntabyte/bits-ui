<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { trigger }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("trigger");

	$: builder = $trigger;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		on:m-click={dispatch}
		on:m-keydown={dispatch}
		{...$$restProps}
	>
		<slot {builder} />
	</button>
{/if}
