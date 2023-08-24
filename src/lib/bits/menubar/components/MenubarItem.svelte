<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { createCustomEventDispatcher } from "$lib/index.js";
	import { disabledAttrs } from "$lib/internal/helpers.js";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let asChild = false;
	export let disabled = false;
	const item = ctx.getMenu().elements.item;
	const dispatch = createCustomEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot builder={$item} />
{:else}
	{@const builder = $item}
	<div
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
	</div>
{/if}
