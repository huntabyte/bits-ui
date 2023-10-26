<script lang="ts">
	import type { CheckboxItemIndicatorProps } from "../types.js";
	import { getAttrs, getCheckboxIndicator } from "../ctx.js";

	type $$Props = CheckboxItemIndicatorProps;
	const checked = getCheckboxIndicator();
	const attrs = getAttrs("checkbox-indicator");
</script>

<div {...$$restProps} {...attrs}>
	{#if $checked}
		<slot checked={$checked} />
	{/if}
</div>
