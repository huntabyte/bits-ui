<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { disabledAttrs } from "$lib/internal/index.js";
	import { getMenuCtx, getAttrs } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let asChild: $$Props["asChild"] = false;
	export let disabled: $$Props["disabled"] = false;

	const {
		elements: { item }
	} = getMenuCtx();
	const dispatch = createDispatcher();

	$: builder = $item;
	$: attrs = { ...getAttrs("item"), ...disabledAttrs(disabled) };
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {...slotProps} />
	</div>
{/if}
