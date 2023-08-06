<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	export let asChild = false;
	const trigger = ctx.getTrigger();
</script>

{#if asChild}
	<slot trigger={$trigger} />
{:else}
	<div use:melt={$trigger} {...$$restProps}>
		<slot trigger={$trigger} />
	</div>
{/if}
