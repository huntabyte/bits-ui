<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemProps } from "../types.js";

	type $$Props = ItemProps;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let label: $$Props["label"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	const item = ctx.setItem(value);
</script>

{#if asChild}
	<slot item={$item} />
{:else}
	<div use:melt={$item({ value, disabled, label })} {...$$restProps}>
		<slot item={$item}>
			{label ? label : value}
		</slot>
	</div>
{/if}
