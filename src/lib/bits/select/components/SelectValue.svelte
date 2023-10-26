<script lang="ts">
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;
	export let placeholder = "";
	export let asChild = false;
	const {
		states: { selectedLabel }
	} = getCtx();

	$: label = $selectedLabel;
	const attrs = getAttrs("value");
</script>

{#if asChild}
	<slot {label} {attrs} />
{:else}
	<span {...$$restProps} {...attrs}>
		{label ? label : placeholder}
	</span>
{/if}
