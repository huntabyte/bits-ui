<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";
	type $$Props = ItemProps;

	export let value: ItemProps["value"];
	export let disabled: ItemProps["disabled"] = undefined;
	export let asChild: ItemProps["asChild"] = false;
	const { item, props } = ctx.setItem({ value, disabled });
</script>

{#if asChild}
	<slot builder={$item(props)} />
{:else}
	<div use:melt={$item(props)} {...$$restProps}>
		<slot builder={$item(props)} />
	</div>
{/if}
