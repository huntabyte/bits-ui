<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;
	export let asChild: TriggerProps["asChild"] = false;

	const { trigger, props } = ctx.getTrigger();

	const dispatch = createCustomEventDispatcher<HTMLButtonElement>();
</script>

{#if asChild}
	<slot builder={$trigger(props)} />
{:else}
	{@const builder = $trigger(props)}
	<button use:melt={builder} {...$$restProps} on:m-keydown={dispatch} on:m-click={dispatch}>
		<slot {builder} />
	</button>
{/if}
