<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { PrevButtonEvents, PrevButtonProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = PrevButtonProps;
	type $$Events = PrevButtonEvents;

	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { prevButton }
	} = getCtx();

	$: builder = $prevButton;

	const attrs = getAttrs("prev-button");
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
