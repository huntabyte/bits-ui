<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx";
	import type { ItemProps } from "../types";
	import { createDispatcher } from "$lib/internal";

	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { item }
	} = getCtx();

	const dispatch = createDispatcher();

	$: builder = $item({ value, disabled });
	const attrs = getAttrs("item");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<button
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} {attrs} />
	</button>
{/if}
