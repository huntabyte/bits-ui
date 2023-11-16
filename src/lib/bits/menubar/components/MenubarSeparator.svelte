<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getMenuCtx, getAttrs } from "../ctx.js";
	import type { SeparatorProps } from "../types.js";

	type $$Props = SeparatorProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { separator }
	} = getMenuCtx();

	const attrs = getAttrs("separator");

	$: builder = $separator;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
