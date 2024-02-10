<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { InputProps, InputEvents } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = InputProps;
	type $$Events = InputEvents;

	export let asChild: $$Props["asChild"] = false;
	export let placeholder: $$Props["placeholder"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { input },
		getAttrs,
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
