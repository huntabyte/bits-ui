<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { setRadioItem, getAttrs } from "../ctx.js";
	import type { RadioItemEvents, RadioItemProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = RadioItemProps;
	type $$Events = RadioItemEvents;
	export let value: $$Props["value"];
	export let disabled = false;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { radioItem }
	} = setRadioItem(value);

	const attrs = getAttrs("radio-item");
	const dispatch = createDispatcher();

	$: builder = $radioItem({ value, disabled });
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div
		bind:this={el}
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
	</div>
{/if}
