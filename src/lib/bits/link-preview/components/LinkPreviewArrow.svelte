<script lang="ts">
	import { ctx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";
	import type { ArrowProps } from "../types.js";

	type $$Props = ArrowProps;

	export let asChild: boolean = false;
	const {
		elements: { arrow }
	} = ctx.get();
</script>

{#if asChild}
	<slot builder={$arrow} />
{:else}
	<div use:melt={$arrow} {...$$restProps} />
{/if}
