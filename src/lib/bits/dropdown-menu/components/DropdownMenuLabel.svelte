<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { LabelProps } from "../types.js";
	type $$Props = LabelProps;
	export let asChild = false;

	const { groupLabel, id } = ctx.getGroupLabel();
	$: builder = $groupLabel(id);
	const attrs = ctx.getAttrs("label");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
