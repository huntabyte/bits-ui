<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";
	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild = false;
	const { item, props } = ctx.setItem({ value, disabled });
</script>

{#if asChild}
	<slot builder={$item(props)} />
{:else}
	{@const builder = $item(props)}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
