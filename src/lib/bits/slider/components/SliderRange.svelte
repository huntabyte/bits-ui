<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { RangeProps } from "../types.js";

	type $$Props = RangeProps;
	export let asChild = false;
	const range = getCtx().elements.range;
	$: builder = $range;
	const attrs = getAttrs("range");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs} />
{/if}
