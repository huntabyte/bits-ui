<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import Overlay from "$lib/internal/overlay.svelte";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger },
		states: { open }
	} = ctx.get();
	const dispatch = createCustomEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if $open}
	{@const builder = $trigger}
	<Overlay />
	{#if asChild}
		<slot {builder} />
	{:else}
		<div
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
{/if}
