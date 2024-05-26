<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { InputEvents, InputProps } from "../index.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = InputProps;
	type $$Events = InputEvents;

	export let asChild: $$Props["asChild"] = false;
	export let placeholder: $$Props["placeholder"] = undefined;
	export let el: $$Props["el"] = undefined;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { input },
		ids,
		getAttrs,
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("input");

	$: if (id) {
		ids.trigger.set(id);
	}

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
