<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let value: $$Props["value"];
	export let disabled = false;
	export let asChild = false;
	const {
		elements: { item }
	} = ctx.setItem(value);
	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot builder={$item} />
{:else}
	{@const builder = $item({ value, disabled })}
	<button
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
