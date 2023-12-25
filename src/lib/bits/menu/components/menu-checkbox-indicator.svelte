<script lang="ts">
	import type { CheckboxIndicatorProps } from "../types.js";
	import { getAttrs, getCheckboxIndicator } from "../ctx.js";

	type $$Props = CheckboxIndicatorProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const checked = getCheckboxIndicator();
	const attrs = getAttrs("checkbox-indicator");
</script>

{#if asChild}
	<slot {attrs} checked={$checked} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		{#if $checked}
			<slot {attrs} checked={$checked} />
		{/if}
	</div>
{/if}
