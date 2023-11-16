<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { IndicatorProps } from "../types.js";

	type $$Props = IndicatorProps;
	export let asChild: $$Props["asChild"] = false;

	const {
		helpers: { isChecked, isIndeterminate }
	} = getCtx();

	const attrs = getAttrs("indicator");

	$: slotProps = {
		isChecked: $isChecked,
		isIndeterminate: $isIndeterminate,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
