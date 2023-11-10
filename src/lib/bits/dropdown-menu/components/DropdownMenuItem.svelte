<script lang="ts">
	import { createDispatcher } from "$lib/internal/events.js";
	import { disabledAttrs } from "$lib/internal/index.js";
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let href: $$Props["href"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let disabled = false;

	const {
		elements: { item }
	} = getCtx();

	$: builder = $item;
	$: attrs = { ...getAttrs("item"), ...disabledAttrs(disabled) };

	const dispatch = createDispatcher();
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
