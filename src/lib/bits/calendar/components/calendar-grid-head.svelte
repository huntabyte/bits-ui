<script lang="ts">
	import { getAttrs } from "../ctx.js";
	import type { GridHeadProps } from "../types.js";

	type $$Props = GridHeadProps;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const attrs = { ...getAttrs("grid-head"), "aria-hidden": true };
</script>

{#if asChild}
	<slot {attrs} />
{:else}
	<thead bind:this={el} {...$$restProps} {...attrs}>
		<slot {attrs} />
	</thead>
{/if}
