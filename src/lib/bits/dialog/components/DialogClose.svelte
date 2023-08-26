<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CloseEvents, CloseProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CloseProps;
	type $$Events = CloseEvents;
	export let asChild = false;
	const {
		elements: { close }
	} = ctx.get();

	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	{@const builder = $close}
	<button use:melt={builder} {...$$restProps} on:m-click={dispatch} on:m-keydown={dispatch}>
		<slot {builder} />
	</button>
{/if}
