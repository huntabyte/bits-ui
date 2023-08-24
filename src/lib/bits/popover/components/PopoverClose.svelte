<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const close = ctx.get().elements.close;
	const dispatch = createCustomEventDispatcher();
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	{@const builder = $close}
	<button use:melt={builder} {...$$restProps} on:m-click={dispatch} on:m-keydown={dispatch}>
		<slot {builder} />
	</button>
{/if}
