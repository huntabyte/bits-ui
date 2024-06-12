<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { TickProps } from "../index.js";

	type $$Props = TickProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;
	export let tick: $$Props["tick"];

	const { getAttrs } = getCtx();

	const attrs = getAttrs("tick");

	$: builder = tick;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span bind:this={ref} use:melt={builder} {...$$restProps} />
{/if}
