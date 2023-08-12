<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
</script>

{#if asChild}
	<slot trigger={$trigger} />
{:else}
	<button use:melt={$trigger} {...$$restProps} on:m-click on:m-keydown on:click on:keydown>
		<slot trigger={$trigger} />
	</button>
{/if}
