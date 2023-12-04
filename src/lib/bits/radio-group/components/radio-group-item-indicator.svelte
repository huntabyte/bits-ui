<script lang="ts">
	import { getRadioIndicator, getAttrs } from "../ctx.js";
	import type { ItemIndicatorProps } from "../types.js";

	type $$Props = ItemIndicatorProps;

	export let asChild = false;

	const { isChecked, value } = getRadioIndicator();

	const attrs = getAttrs("item-indicator");

	$: slotProps = {
		checked: $isChecked(value),
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div {...attrs} {...$$restProps}>
		{#if $isChecked(value)}
			<slot {...slotProps} />
		{/if}
	</div>
{/if}
