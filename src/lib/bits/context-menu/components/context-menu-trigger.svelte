<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { trigger },
		ids
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("trigger");

	$: if (id) {
		ids.trigger.set(id);
	}

	$: builder = $trigger;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-contextmenu={dispatch}
		on:m-pointercancel={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointermove={dispatch}
		on:m-pointerup={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
