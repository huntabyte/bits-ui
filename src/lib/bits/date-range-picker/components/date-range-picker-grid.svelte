<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCalendarAttrs, getCtx } from "../ctx.js";
	import type { GridProps } from "../types.js";

	type $$Props = GridProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { grid }
	} = getCtx();

	const attrs = getCalendarAttrs("grid");

	$: builder = $grid;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<table use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</table>
{/if}
