<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";

	type $$Props = ItemProps;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { item }
	} = ctx.get();
</script>

{#if asChild}
	<slot item={$item} />
{:else}
	<div use:melt={$item} {...$$restProps} on:m-click>
		<slot item={$item} />
	</div>
{/if}
