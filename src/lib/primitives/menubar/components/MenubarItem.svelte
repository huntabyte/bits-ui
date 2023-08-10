<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";

	type $$Props = ItemProps;
	export let asChild: $$Props["asChild"] = false;
	const { item } = ctx.getItem();
</script>

{#if asChild}
	<slot item={$item} />
{:else}
	<div use:melt={$item} {...$$restProps}>
		<slot item={$item} />
	</div>
{/if}
