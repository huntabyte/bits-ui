<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createDispatcher } from "$lib/internal/events.js";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ActionEvents, ActionProps } from "../types.js";

	type $$Props = ActionProps;
	type $$Events = ActionEvents;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { close }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("action");

	$: builder = $close;
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
		on:m-keydown={dispatch}
	>
		<slot {...slotProps} />
	</button>
{/if}
