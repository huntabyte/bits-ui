<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ViewportProps } from "../types.js";
	import { getCtx } from "../ctx.js";

	type $$Props = ViewportProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

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
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
