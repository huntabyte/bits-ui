<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setItemCtx } from "../ctx.js";
	import type { ItemEvents, ItemProps } from "../index.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ItemProps;
	type $$Events = ItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = undefined;
	export let label: $$Props["label"] = undefined;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { option: item },
		helpers: { isSelected: isSelectedStore },
		getAttrs,
	} = setItemCtx(value);

	const dispatch = createDispatcher();
	const attrs = getAttrs("item");

	$: builder = $item({ value, disabled, label });
	$: Object.assign(builder, attrs);
	$: isSelected = $isSelectedStore(value);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if asChild}
	<slot {builder} {isSelected} />
{:else}
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-pointermove={dispatch}
		on:focusin
		on:keydown
		on:focusout
		on:pointerleave
	>
		<slot {builder} {isSelected}>
			{label || value}
		</slot>
	</div>
{/if}
