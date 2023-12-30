<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItemCtx, getAttrs } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { item }
	} = setItemCtx(value);

	const dispatch = createDispatcher();
	const attrs = getAttrs("item");

	$: builder = $item({ value, disabled });
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
