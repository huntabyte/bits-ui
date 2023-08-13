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
	<div use:melt={$group(id)} {...$$restProps}>
		<slot builder={$group(id)} />
	</div>
{/if}
