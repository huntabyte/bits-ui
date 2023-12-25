<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputEvents, InputProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = InputProps;
	type $$Events = InputEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { input }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("input");

	$: builder = $input();
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<input
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
		on:m-input={dispatch}
		on:m-paste={dispatch}
		on:m-change={dispatch}
		on:m-focus={dispatch}
		on:m-blur={dispatch}
	/>
{/if}
