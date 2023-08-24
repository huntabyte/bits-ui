<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { CancelEvents, CancelProps } from "../types.js";

	type $$Props = CancelProps;
	type $$Events = CancelEvents;
	export let asChild = false;
	const close = ctx.get().elements.close;

	const dispatch = createCustomEventDispatcher();
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	{@const builder = $close}
	<button use:melt={builder} on:m-click={dispatch} on:m-keydown={dispatch} {...$$restProps}>
		<slot {builder} />
	</button>
{/if}
