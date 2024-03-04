<script lang="ts">
	import type { ThumbYProps } from "../types.js";
	import { getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";

	type $$Props = ThumbYProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { thumbY },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("thumb-y");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $thumbY;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
