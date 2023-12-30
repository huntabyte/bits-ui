<script lang="ts">
	import type { RadioIndicatorProps } from "../types.js";
	import { getAttrs, getRadioIndicator } from "../ctx.js";

	type $$Props = RadioIndicatorProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { isChecked, value } = getRadioIndicator();
	const attrs = getAttrs("radio-indicator");
	$: checked = $isChecked(value);
</script>

{#if asChild}
	<slot {attrs} {checked} />
{:else}
	<div bind:this={el} {...$$restProps} {...attrs}>
		{#if checked}
			<slot {attrs} {checked} />
		{/if}
	</div>
{/if}
