<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { SeparatorProps } from "../types.js";

	type $$Props = SeparatorProps;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { separator }
	} = getCtx();

	const attrs = getAttrs("separator");

	$: builder = $separator;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={$separator} {...$$restProps} />
{/if}
