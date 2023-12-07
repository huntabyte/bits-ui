<script lang="ts">
	import type { CheckboxIndicatorProps } from "../types.js";
	import { getAttrs, getCheckboxIndicator } from "../ctx.js";

	type $$Props = CheckboxIndicatorProps;
	export let asChild: $$Props["asChild"] = false;

	const checked = getCheckboxIndicator();
	const attrs = getAttrs("checkbox-indicator");
</script>

{#if asChild}
	<slot {attrs} checked={$checked} />
{:else}
	<div {...$$restProps} {...attrs}>
		{#if $checked}
			<slot {attrs} checked={$checked} />
		{/if}
	</div>
{/if}
