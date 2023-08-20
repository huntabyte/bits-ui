<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const trigger = ctx.get().elements.trigger;
</script>

{#if asChild}
	<slot builder={$trigger({ value, disabled })} />
{:else}
	{@const builder = $trigger({ value, disabled })}
	<button use:melt={builder} {...$$restProps} on:m-click on:m-focus on:m-keydown>
		<slot {builder} />
	</button>
{/if}
