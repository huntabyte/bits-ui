<script lang="ts">
	import { ctx } from "../ctx.js";
	import type { ValueProps } from "../types.js";

	type $$Props = ValueProps;
	export let placeholder = "";
	export let asChild = false;
	const {
		states: { selectedLabel }
	} = ctx.get();
</script>

{#if asChild}
	<slot label={$selectedLabel} />
{:else}
	<span {...$$restProps}>
		{$selectedLabel ? $selectedLabel : placeholder}
	</span>
{/if}
