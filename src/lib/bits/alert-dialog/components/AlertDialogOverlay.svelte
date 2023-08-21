<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { OverlayProps } from "../types.js";

	type $$Props = OverlayProps;
	export let asChild = false;
	const {
		elements: { overlay },
		states: { open },
		tOpen
	} = ctx.get();
</script>

{#if $tOpen}
	{@const builder = $overlay}
	{#if asChild}
		<slot {builder} />
	{:else}
		<div use:melt={builder} {...$$restProps} />
	{/if}
{/if}
