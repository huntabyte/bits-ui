<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild = false;

	const trigger = ctx.get().elements.trigger;
	const dispatch = createCustomEventDispatcher();
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
