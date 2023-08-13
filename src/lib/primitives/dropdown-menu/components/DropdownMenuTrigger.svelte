<script lang="ts">
	import { ctx } from "../ctx.js";
	import { melt } from "@melt-ui/svelte";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const {
		elements: { trigger }
	} = ctx.get();
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	<button use:melt={$trigger} {...$$restProps} on:m-keydown on:m-pointerdown on:click on:keydown>
		<slot builder={$trigger} />
	</button>
{/if}
