<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { RangeProps } from "../types.js";

	type $$Props = RangeProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { range }
	} = getCtx();

	const attrs = getAttrs("range");

	$: builder = $range;
	$: slotProps = { builder, attrs };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs} />
{/if}
