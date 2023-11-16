<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { disabledAttrs } from "$lib/internal/index.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let asChild: $$Props["asChild"] = false;
	export let disabled: $$Props["disabled"] = false;
	export let href: $$Props["href"] = undefined;

	const {
		elements: { item }
	} = getCtx();

	const dispatch = createDispatcher();

	$: builder = $item;
	$: attrs = { ...getAttrs("item"), ...disabledAttrs(disabled) };
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<svelte:element
		this={href ? "a" : "div"}
		{href}
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
		<slot {builder} {attrs} />
	</svelte:element>
{/if}
