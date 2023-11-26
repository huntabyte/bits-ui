<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { TriggerEvents, TriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = TriggerProps;
	type $$Events = TriggerEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { trigger }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("trigger");

	$: builder = $trigger({ value, disabled });
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		use:melt={builder}
		type="button"
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-focus={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {...slotProps} />
	</button>
{/if}
