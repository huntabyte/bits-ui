<script lang="ts">
	import type { CheckboxItemIndicatorProps } from "../types.js";
	import { ctx } from "../ctx.js";

	type $$Props = CheckboxItemIndicatorProps;
	const checked = ctx.getCheckboxIndicator();
	const attrs = ctx.getAttrs("checkbox-indicator");
</script>

<div {...$$restProps} {...attrs}>
	{#if $checked}
		<slot checked={$checked} />
	{/if}
</div>
