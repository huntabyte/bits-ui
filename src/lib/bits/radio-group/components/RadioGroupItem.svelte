<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const item = ctx.setItem(value).elements.item;
</script>

{#if asChild}
	<slot builder={$item} />
{:else}
	<button use:melt={$item({ value, disabled })} {...$$restProps} on:m-click on:m-focus on:m-keydown>
		<slot builder={$item} />
	</button>
{/if}
