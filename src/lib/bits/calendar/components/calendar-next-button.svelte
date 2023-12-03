<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { NextButtonEvents, NextButtonProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = NextButtonProps;
	type $$Events = NextButtonEvents;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { nextButton }
	} = getCtx();

	$: builder = $nextButton;

	const attrs = getAttrs("next-button");
	const dispatch = createDispatcher();

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
	>
		<slot {...slotProps} />
	</button>
{/if}
