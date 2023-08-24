<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
	const dispatch = createCustomEventDispatcher();
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	{@const builder = $trigger}
	<button use:melt={builder} {...$$restProps} on:m-keydown={dispatch} on:m-pointerdown={dispatch}>
		<slot {builder} />
	</button>
{/if}
