<script lang="ts">
	import type { ScrollbarYProps } from "../types.js";
	import { getCtx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";

	type $$Props = ScrollbarYProps;

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
	<div use:melt={builder} bind:this={el}>
		<slot {builder} />
	</div>
{/if}
