<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getTrigger, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild: TriggerProps["asChild"] = false;

	const { trigger, props } = getTrigger();

	const dispatch = createDispatcher();

	$: builder = $trigger(props);
	const attrs = getAttrs("trigger");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		type="button"
		{...$$restProps}
		{...attrs}
		on:m-keydown={dispatch}
		on:m-click={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
