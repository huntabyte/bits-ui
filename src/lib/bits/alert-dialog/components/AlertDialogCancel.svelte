<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { CancelEvents, CancelProps } from "../types.js";

	type $$Props = CancelProps;
	type $$Events = CancelEvents;
	export let asChild = false;
	const {
		elements: { close },
		createDispatcher
	} = ctx.get();

	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot builder={$close} />
{:else}
	{@const builder = $close}
	<button use:melt={builder} on:m-click={dispatch} on:m-keydown={dispatch} {...$$restProps}>
		<slot {builder} />
	</button>
{/if}
