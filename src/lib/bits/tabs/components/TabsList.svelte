<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ListProps } from "../types.js";
	type $$Props = ListProps;

	export let asChild = false;
	const list = ctx.get().elements.list;

	$: builder = $list;
	const attrs = ctx.getAttrs("list");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
