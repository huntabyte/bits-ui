<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ListProps } from "../types.js";
	type $$Props = ListProps;

	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { list }
	} = getCtx();

	$: builder = $list;
	const attrs = getAttrs("list");
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
