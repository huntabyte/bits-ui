<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ListProps } from "../types.js";
	type $$Props = ListProps;

	export let asChild = false;
	const {
		elements: { list }
	} = getCtx();

	$: builder = $list;
	const attrs = getAttrs("list");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
