<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type {
		DropdownTriggerEvents,
		DropdownTriggerProps
	} from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = DropdownTriggerProps;
	type $$Events = DropdownTriggerEvents;

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
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
