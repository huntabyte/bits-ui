<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { GridRowProps } from "../index.js";

	type $$Props = GridRowProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;
	const { getAttrs } = getCtx();

	const attrs = getAttrs("grid-row");
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<tr bind:this={ref} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</tr>
{/if}
