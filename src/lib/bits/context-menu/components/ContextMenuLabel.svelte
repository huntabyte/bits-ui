<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { LabelProps } from "../types.js";
	type $$Props = LabelProps;
	export let asChild = false;
	const { groupLabel, id } = ctx.getGroupLabel();
</script>

{#if asChild}
	<slot builder={$groupLabel(id)} />
{:else}
	{@const builder = $groupLabel(id)}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
