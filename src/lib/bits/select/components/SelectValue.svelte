<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;
	export let placeholder = "";
	export let asChild = false;
	const {
		states: { selectedLabel }
	} = ctx.get();

	$: label = $selectedLabel;
	const attrs = ctx.getAttrs("value");
</script>

{#if asChild}
	<slot {label} {attrs} />
{:else}
	<span {...$$restProps} {...attrs}>
		{label ? label : placeholder}
	</span>
{/if}
