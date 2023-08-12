<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { close }
	} = ctx.get();
</script>

{#if asChild}
	<slot close={$close} />
{:else}
	<button use:melt={$close} {...$$restProps} on:m-click on:m-keydown on:click on:keydown>
		<slot close={$close} />
	</button>
{/if}
