<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { disabledAttrs } from "$lib/internal/helpers.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let asChild: $$Props["asChild"] = false;
	export let disabled = false;
	const item = ctx.get().elements.item;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / role applied by melt store-->
{#if asChild}
	<slot builder={$item} />
{:else}
	<div
		use:melt={$item}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerdown
		on:m-pointerleave
		on:m-pointermove
		{...disabledAttrs(disabled)}
	>
		<slot builder={$item} />
	</div>
{/if}
