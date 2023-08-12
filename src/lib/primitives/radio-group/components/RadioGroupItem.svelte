<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { item }
	} = ctx.setItem(value);
</script>

{#if asChild}
	<slot item={$item} />
{:else}
	<button
		use:melt={$item({ value, disabled })}
		{...$$restProps}
		on:m-click
		on:m-focus
		on:m-keydown
		on:click
		on:keydown
	>
		<slot item={$item} />
	</button>
{/if}
