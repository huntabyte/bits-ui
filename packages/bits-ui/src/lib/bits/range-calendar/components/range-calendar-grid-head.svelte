<script lang="ts">
	import { getCtx } from "../ctx.js";
	import type { GridHeadProps } from "../index.js";

	type $$Props = GridHeadProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;
	const { getAttrs } = getCtx();

	const attrs = { ...getAttrs("grid-head"), "aria-hidden": true };
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<thead bind:this={ref} {...$$restProps} {...attrs}>
		<slot />
	</thead>
{/if}
