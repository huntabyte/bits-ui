<script lang="ts">
	import { setArrow, getAttrs } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;

	export let asChild: $$Props["asChild"] = false;
	export let size = 8;

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
	<div use:melt={builder} {...$$restProps} />
{/if}
