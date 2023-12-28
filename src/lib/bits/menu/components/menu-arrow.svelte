<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setArrow, getAttrs } from "../ctx.js";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;

	export let size: $$Props["size"] = 8;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { arrow }
	} = setArrow(size);

	const attrs = getAttrs("arrow");

	$: builder = $arrow;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps} />
{/if}
