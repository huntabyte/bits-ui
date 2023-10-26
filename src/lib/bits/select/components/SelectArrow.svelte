<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;

	export let asChild = false;
	export let size = 8;

	const {
		elements: { arrow }
	} = ctx.setArrow(size);

	$: builder = $arrow;
	const attrs = ctx.getAttrs("arrow");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
