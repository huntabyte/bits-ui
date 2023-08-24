<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { disabledAttrs } from "$lib/internal/helpers.js";
	import { createCustomEventDispatcher } from "$lib/index.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let asChild: $$Props["asChild"] = false;
	export let disabled = false;
	const item = ctx.get().elements.item;
	const dispatch = createCustomEventDispatcher();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / role applied by melt store-->
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
