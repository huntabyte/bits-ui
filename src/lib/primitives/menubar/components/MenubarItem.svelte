<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;
	export let asChild: $$Props["asChild"] = false;
	const {
		elements: { item }
	} = ctx.getMenu();
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot item={$item} />
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
		on:click
		on:keydown
	>
		<slot item={$item} />
	</div>
{/if}
