<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/index.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = ctx.get().elements.trigger;
	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	{@const builder = $trigger}
	<button
		use:melt={builder}
		{...$$restProps}
		on:m-blur={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerenter={dispatch}
		on:m-pointerleave={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
