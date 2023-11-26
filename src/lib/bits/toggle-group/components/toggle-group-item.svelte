<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ItemProps, ItemEvents } from "../types.js";
	import { createDispatcher } from "$lib/internal";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { item }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("item");

	$: builder = $item({ value, disabled });
	$: slotProps = { builder, attrs };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {...slotProps} />
	</button>
{/if}
