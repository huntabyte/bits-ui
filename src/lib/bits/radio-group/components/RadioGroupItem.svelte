<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItemCtx, getAttrs } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let value: $$Props["value"];
	export let disabled = false;
	export let asChild = false;
	const {
		elements: { item }
	} = setItemCtx(value);
	const dispatch = createDispatcher();

	$: builder = $item({ value, disabled });
	const attrs = getAttrs("item");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		type="button"
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
