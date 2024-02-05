<script lang="ts">
	import { getRadioIndicator } from "../ctx.js";
	import type { ItemIndicatorProps } from "../types.js";

	type $$Props = ItemIndicatorProps;

	export let asChild = false;
	export let el: $$Props["el"] = undefined;

	const {
		helpers: { isChecked },
		value,
		getAttrs,
	} = getRadioIndicator();

	const attrs = getAttrs("item-indicator");
	$: checked = $isChecked(value);
</script>

{#if asChild}
	<slot {checked} {attrs} />
{:else}
	<div bind:this={el} {...attrs} {...$$restProps}>
		{#if checked}
			<slot {checked} {attrs} />
		{/if}
	</div>
{/if}
