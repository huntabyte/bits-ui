<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ViewportProps } from "../index.js";
	import { getCtx } from "../ctx.js";

	type $$Props = ViewportProps;

	export let asChild: $$Props["asChild"] = false;
	export let ref: $$Props["el"] = undefined;

	const {
		elements: { viewport },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("viewport");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $viewport;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={ref}>
		<slot {builder} />
	</div>
{/if}

<style>
	/* Hide scrollbars cross browser and enable momentum scroll for touch devices */
	:global([data-scroll-area-viewport]) {
		scrollbar-width: none !important;
		-ms-overflow-style: none !important;
		-webkit-overflow-scrolling: touch !important;
	}
	:global([data-scroll-area-viewport])::-webkit-scrollbar {
		display: none !important;
	}
</style>