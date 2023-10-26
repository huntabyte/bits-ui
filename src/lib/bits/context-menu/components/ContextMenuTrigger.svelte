<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = getCtx();
	const dispatch = createDispatcher();
	$: builder = $trigger;
	const attrs = getAttrs("trigger");
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-contextmenu={dispatch}
		on:m-pointercancel={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointermove={dispatch}
		on:m-pointerup={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{/if}
