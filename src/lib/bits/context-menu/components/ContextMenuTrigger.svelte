<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	<slot builder={$trigger} />
{:else}
	{@const builder = $trigger}
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
