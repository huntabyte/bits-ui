<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TickProps } from "../types.js";

	type $$Props = TickProps;
	export let asChild = false;
	const {
		elements: { tick }
	} = getCtx();
	$: builder = $tick();
	const attrs = getAttrs("tick");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs} />
{/if}
