<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { GridProps } from "../index.js";

	type $$Props = GridProps;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { grid },
		getAttrs,
	} = getCtx();

	const attrs = getAttrs("grid");
	$: builder = $grid;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<table bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</table>
{/if}
