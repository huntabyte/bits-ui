<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ThumbProps } from "../index.js";
	import { getCtx } from "../ctx.js";

	type $$Props = ThumbProps;

	export let asChild: $$Props["asChild"] = false;
	export let ref: $$Props["el"] = undefined;

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
	<div use:melt={builder} bind:this={ref}>
		<slot {builder} />
	</div>
{/if}
