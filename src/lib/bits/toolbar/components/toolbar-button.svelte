<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getAttrs, getCtx } from "../ctx.js";
	import type { ButtonEvents, ButtonProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = ButtonProps;
	type $$Events = ButtonEvents;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { button }
	} = getCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("button");

	$: builder = $button;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		type="button"
		{...$$restProps}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
