<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/index.js";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

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
	$: slotProps = { builder, attrs };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		use:melt={builder}
		type="button"
		{...$$restProps}
		{...attrs}
		on:m-blur={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {...slotProps} />
	</button>
{/if}
