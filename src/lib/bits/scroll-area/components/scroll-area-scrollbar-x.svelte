<script lang="ts">
	import type { ScrollbarProps } from "../types.js";
	import { getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";

	type $$Props = Omit<ScrollbarProps, "orientation">;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { scrollbarX },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("scrollbar-x");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $scrollbarX;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
