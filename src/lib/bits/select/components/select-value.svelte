<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;

	export let placeholder: $$Props["placeholder"] = "";
	export let asChild: $$Props["asChild"] = false;

	const {
		states: { selectedLabel }
	} = getCtx();
	const attrs = getAttrs("value");

	$: label = $selectedLabel;
</script>

{#if asChild}
	<slot {label} {attrs} />
{:else}
	<span {...$$restProps} {...attrs}>
		{label ? label : placeholder}
	</span>
{/if}
