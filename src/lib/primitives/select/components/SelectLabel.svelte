<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { LabelEvents, LabelProps } from "../types.js";

	type $$Props = LabelProps;
	type $$Events = LabelEvents;
	export let asChild = false;
	const { groupLabel, id } = ctx.getGroupLabel();
</script>

{#if asChild}
	<slot builder={$groupLabel(id)} />
{:else}
	<div use:melt={$groupLabel(id)} {...$$restProps}>
		<slot builder={$groupLabel(id)} />
	</div>
{/if}
