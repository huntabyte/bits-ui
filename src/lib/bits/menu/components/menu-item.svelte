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
	export let disabled: $$Props["disabled"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { item }
	} = getCtx();
	const dispatch = createDispatcher();

	$: builder = $item;
	$: attrs = { ...getAttrs("item"), ...disabledAttrs(disabled) };
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<svelte:element
		this={href ? "a" : "div"}
		bind:this={el}
		{href}
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerdown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</svelte:element>
{/if}
