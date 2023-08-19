<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;
	export let size = 8;
	export let asChild = false;

	const {
		elements: { arrow }
	} = ctx.setArrow(size);
</script>

{#if asChild}
	<slot builder={$arrow} />
{:else}
	<div use:melt={$arrow} />
{/if}
