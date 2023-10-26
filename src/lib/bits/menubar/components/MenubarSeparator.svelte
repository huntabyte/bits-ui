<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getMenuCtx, getAttrs } from "../ctx.js";
	import type { SeparatorProps } from "../types.js";

	type $$Props = SeparatorProps;
	export let asChild = false;
	const {
		elements: { separator }
	} = getMenuCtx();
	$: builder = $separator;
	const attrs = getAttrs("separator");
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs} />
{/if}
