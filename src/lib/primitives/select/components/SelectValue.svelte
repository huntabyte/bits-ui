<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;
	export let placeholder: $$Props["placeholder"] = "";
	export let asChild = false;
	const valueLabel = ctx.get().states.valueLabel;
</script>

{#if asChild}
	<slot valueLabel={$valueLabel} />
{:else}
	<span {...$$restProps}>
		{$valueLabel ? $valueLabel : placeholder}
	</span>
{/if}
