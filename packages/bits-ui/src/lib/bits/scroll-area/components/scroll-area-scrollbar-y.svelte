<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import type { ScrollbarProps } from "../index.js";
	import { getCtx } from "../ctx.js";

	type $$Props = Omit<ScrollbarProps, "orientation">;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { scrollbarY },
		getAttrs,
	} = getCtx();

	const bitsAttrs = getAttrs("scrollbar-y");

	$: attrs = {
		...$$restProps,
		...bitsAttrs,
	};

	$: builder = $scrollbarY;

	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} bind:this={ref}>
		<slot {builder} />
	</div>
{/if}
