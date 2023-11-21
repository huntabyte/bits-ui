<script lang="ts">
	import { getAttrs, getItemIndicator } from "../ctx.js";
	import type { IndicatorProps } from "../types.js";

	type $$Props = IndicatorProps;

	export let asChild: $$Props["asChild"] = false;

	const { isSelected, value } = getItemIndicator();
	const attrs = getAttrs("indicator");

	$: slotProps = {
		isSelected: $isSelected(value),
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else if $isSelected(value)}
	<div {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
