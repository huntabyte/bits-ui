<script lang="ts">
	import { setArrow, getAttrs } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;

	export let asChild = false;
	export let size = 8;
	const arrow = setArrow(size).elements.arrow;
	$: builder = $arrow;
	const attrs = getAttrs("arrow");
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
