<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { GroupProps } from "../types.js";
	type $$Props = GroupProps;
	export let asChild = false;
	const { group, id } = ctx.setGroup();
</script>

{#if asChild}
	<slot builder={$group(id)} />
{:else}
	{@const builder = $group(id)}
	<div use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
