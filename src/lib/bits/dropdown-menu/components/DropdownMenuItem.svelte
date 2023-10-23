<script lang="ts">
	import { createDispatcher } from "$lib/internal/events.js";
	import { disabledAttrs } from "$lib/internal/helpers.js";
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let href: $$Props["href"] = undefined;
	export let asChild = false;
	export let disabled = false;
	const {
		elements: { item }
	} = ctx.get();

	const dispatch = createDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions applied by melt's action/store -->
{#if asChild}
	<slot builder={$item} />
{:else}
	{@const builder = $item}
	<svelte:element
		this={href ? "a" : "div"}
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
		{...disabledAttrs(disabled)}
	>
		<slot {builder} />
	</svelte:element>
{/if}
