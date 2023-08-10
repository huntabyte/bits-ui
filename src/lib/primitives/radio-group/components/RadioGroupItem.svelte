<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";

	type $$Props = ItemProps;
	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	const { item } = ctx.setItem(value);
</script>

{#if asChild}
	<slot item={$item} />
{:else}
	<button use:melt={$item({ value, disabled })} {...$$restProps}>
		<slot item={$item} />
	</button>
{/if}
