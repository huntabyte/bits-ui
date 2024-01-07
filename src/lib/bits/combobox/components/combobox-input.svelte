<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx";
	import type { InputProps, InputEvents } from "../types";
	import { createDispatcher } from "$lib/internal/events";

	type $$Props = InputProps;
	type $$Events = InputEvents;

	export let asChild: $$Props["asChild"] = false;
	export let placeholder: $$Props["placeholder"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { input }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("input");

	$: builder = $input;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} {placeholder} />
{:else}
	<input
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		{placeholder}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
		on:m-input={dispatch}
	/>
{/if}
