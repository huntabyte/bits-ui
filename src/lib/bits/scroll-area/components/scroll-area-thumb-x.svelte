<script lang="ts">
	import type { ThumbProps } from "../types.js";
	import { getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";

	type $$Props = ThumbProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { thumbX },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("thumb-x");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $thumbX;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
