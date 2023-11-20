<script lang="ts">
	import type { CheckboxIndicatorProps } from "../types.js";
	import { getAttrs, getCheckboxIndicator } from "../ctx.js";

	type $$Props = CheckboxIndicatorProps;
	export let asChild: $$Props["asChild"] = false;

	const checked = getCheckboxIndicator();
	const attrs = getAttrs("checkbox-indicator");

	$: slotProps = {
		attrs,
		checked: $checked
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div {...$$restProps} {...attrs}>
		{#if $checked}
			<slot {...slotProps} />
		{/if}
	</div>
{/if}
