<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild = false;

	const trigger = ctx.get().elements.trigger;
	const dispatch = createDispatcher();
</script>

{#if asChild}
	<slot builder={$trigger({ value, disabled })} />
{:else}
	{@const builder = $trigger({ value, disabled })}
	<button
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
