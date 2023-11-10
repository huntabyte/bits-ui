<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	const {
		elements: { trigger },
		ids
	} = getCtx();
	const dispatch = createDispatcher();

	$: if (id) {
		ids.trigger.set(id);
	}
	$: builder = $trigger;
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
		on:m-pointerdown={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
