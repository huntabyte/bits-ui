<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { GridProps } from "../types.js";

	type $$Props = GridProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { grid }
	} = getCtx();

	$: builder = $grid;

	const attrs = getAttrs("grid");

	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<table use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</table>
{/if}
