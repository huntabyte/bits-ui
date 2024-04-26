<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setArrow } from "../ctx.js";
	import type { ArrowProps } from "../index.js";

	type $$Props = ArrowProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;
	export let size = 8;

	const {
		elements: { arrow },
		getAttrs,
	} = setArrow(size);

	const attrs = getAttrs("arrow");

	$: builder = $arrow;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}></div>
{/if}
