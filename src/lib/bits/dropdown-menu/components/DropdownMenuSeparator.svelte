<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { SeparatorProps } from "../types.js";

	type $$Props = SeparatorProps;
	export let asChild = false;
	const separator = ctx.get().elements.separator;
	$: builder = $separator;
	const attrs = ctx.getAttrs("separator");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={$separator} {...$$restProps} {...attrs} />
{/if}
