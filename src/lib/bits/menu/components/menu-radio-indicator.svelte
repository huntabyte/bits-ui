<script lang="ts">
	import type { RadioIndicatorProps } from "../types.js";
	import { getAttrs, getRadioIndicator } from "../ctx.js";

	type $$Props = RadioIndicatorProps;
	export let asChild: $$Props["asChild"] = false;

	const { isChecked, value } = getRadioIndicator();
	const attrs = getAttrs("radio-indicator");

	$: slotProps = {
		checked: $isChecked(value),
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div {...$$restProps} {...attrs}>
		{#if $isChecked(value)}
			<slot {...slotProps} />
		{/if}
	</div>
{/if}
