<script lang="ts">
	import { getItemIndicator } from "../ctx.js";
	import type { IndicatorProps } from "../index.js";

	type $$Props = IndicatorProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { isSelected, value, getAttrs } = getItemIndicator();
	const attrs = getAttrs("indicator");
</script>

{#if asChild}
	<slot {attrs} isSelected={$isSelected(value)} />
{:else}
	<div bind:this={ref} {...$$restProps} {...attrs}>
		{#if $isSelected(value)}
			<slot {attrs} isSelected={$isSelected(value)} />
		{/if}
	</div>
{/if}
