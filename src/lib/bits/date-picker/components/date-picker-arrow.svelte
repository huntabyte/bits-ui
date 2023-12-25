<script lang="ts">
	import { getPopoverAttrs, getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;
	export let size = 8;

	const {
		elements: { arrow },
		updateOption
	} = getCtx();

	const attrs = getPopoverAttrs("arrow");

	$: updateOption("arrowSize", size);

	$: builder = $arrow;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps} />
{/if}
