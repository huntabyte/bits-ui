<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ListProps } from "../types.js";
	type $$Props = ListProps;

	export let asChild = false;
	const list = ctx.get().elements.list;
</script>

{#if asChild}
	<slot builder={$list} />
{:else}
	{@const builder = $list}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
