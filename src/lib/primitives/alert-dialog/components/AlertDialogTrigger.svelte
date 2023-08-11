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
	<button use:melt={$trigger} on:click on:keydown {...$$restProps}>
		<slot trigger={$trigger} />
	</button>
{/if}
