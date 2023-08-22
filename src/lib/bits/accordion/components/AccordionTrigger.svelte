<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild: TriggerProps["asChild"] = false;

	const { trigger, props } = ctx.getTrigger();
</script>

{#if asChild}
	<slot builder={$trigger(props)} />
{:else}
	{@const builder = $trigger(props)}
	<button use:melt={builder} {...$$restProps} on:m-keydown on:m-click>
		<slot {builder} />
	</button>
{/if}
