<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createCustomEventDispatcher } from "$lib";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let value: $$Props["value"];
	export let disabled = false;
	export let asChild = false;
	const item = ctx.setItem(value).elements.item;
	const dispatch = createCustomEventDispatcher();
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
