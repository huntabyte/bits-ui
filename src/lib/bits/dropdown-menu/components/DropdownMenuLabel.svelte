<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { LabelProps } from "../types.js";
	type $$Props = LabelProps;
	export let asChild = false;

	const { groupLabel, id } = ctx.getGroupLabel();
</script>

{#if asChild}
	<slot builder={{ ...$groupLabel(id), "data-melt-dropdown-menu-label": "" }} />
{:else}
	<div use:melt={{ ...$groupLabel(id), "data-melt-dropdown-menu-label": "" }} {...$$restProps}>
		<slot builder={{ ...$groupLabel(id), "data-melt-dropdown-menu-label": "" }} />
	</div>
{/if}
