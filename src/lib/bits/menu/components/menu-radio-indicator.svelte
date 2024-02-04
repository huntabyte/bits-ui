<script lang="ts">
	import type { RadioIndicatorProps } from "../types.js";
	import { getRadioIndicator } from "../ctx.js";

	type $$Props = RadioIndicatorProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		helpers: { isChecked },
		value,
		getAttrs,
	} = getRadioIndicator();

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
