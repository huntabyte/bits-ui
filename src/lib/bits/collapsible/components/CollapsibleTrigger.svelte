<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/events.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	{@const builder = $trigger}
	<button use:melt={builder} {...$$restProps} on:m-click={dispatch}>
		<slot {builder} />
	</button>
{/if}
