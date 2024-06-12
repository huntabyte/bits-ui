<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { HeadCellProps } from "../index.js";

	type $$Props = HeadCellProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const { getAttrs } = getCtx();

	const attrs = getAttrs("head-cell");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<th bind:this={ref} {...$$restProps} {...attrs}>
		<slot />
	</th>
{/if}
