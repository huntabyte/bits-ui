<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild = false;
	const trigger = ctx.get().elements.trigger;
</script>

{#if asChild}
	<slot builder={$trigger} />
{:else}
	<button use:melt={$trigger} on:m-click on:m-keydown {...$$restProps}>
		<slot builder={$trigger} />
	</button>
{/if}
