<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = getCtx().elements.trigger;
	const dispatch = createDispatcher();

	$: builder = $trigger;
	const attrs = getAttrs("trigger");
</script>

{#if asChild}
	<slot {attrs} {builder} />
{:else}
	{@const builder = $trigger}
	<svelte:element
		this={"a"}
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-blur={dispatch}
		on:m-focus={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} {attrs} />
	</svelte:element>
{/if}
