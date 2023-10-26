<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { ctx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let label: $$Props["label"] = undefined;
	export let asChild = false;
	const {
		elements: { option }
	} = ctx.setItem(value);
	const dispatch = createDispatcher();
	$: builder = $option({ value, disabled, label });
	const attrs = ctx.getAttrs("item");
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-pointermove={dispatch}
		on:focusin
		on:keydown
		on:focusout
		on:pointerleave
	>
		<slot {builder} {attrs}>
			{label ? label : value}
		</slot>
	</div>
{/if}
