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
	const attrs = getAttrs("trigger");

	$: builder = $trigger(props);
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-keydown={dispatch}
		on:m-click={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
