<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { RangeProps } from "../index.js";

	type $$Props = RangeProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { range },
		getAttrs,
	} = getCtx();

	const attrs = getAttrs("range");

	$: builder = $range;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span bind:this={ref} use:melt={builder} {...$$restProps} />
{/if}
