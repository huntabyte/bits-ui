<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItemCtx, getAttrs } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let label: $$Props["label"] = undefined;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { option: item }
	} = setItemCtx(value);

	const dispatch = createDispatcher();
	const attrs = getAttrs("item");

	$: builder = $item({ value, disabled, label });
	$: slotProps = { builder, attrs };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot {...slotProps} />
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
		<slot {...slotProps}>
			{label ? label : value}
		</slot>
	</div>
{/if}
