<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;

	export let placeholder: $$Props["placeholder"] = "";
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		states: { selectedLabel },
		getAttrs,
	} = getCtx();
	const attrs = getAttrs("value");

	$: label = $selectedLabel;
</script>

{#if asChild}
	<slot {label} {attrs} />
{:else}
	<span bind:this={el} {...$$restProps} {...attrs} data-placeholder={!label ? "" : undefined}>
		{label ? label : placeholder}
	</span>
{/if}
