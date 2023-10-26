<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { SeparatorProps } from "../types.js";

	type $$Props = SeparatorProps;
	export let asChild = false;
	const separator = getCtx().elements.separator;
	$: builder = $separator;
	const attrs = getAttrs("separator");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={$separator} {...$$restProps} {...attrs} />
{/if}
