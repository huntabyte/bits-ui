<script lang="ts">
	import { melt, createLabel } from "@melt-ui/svelte";
	import { getAttrs } from "../ctx.js";
	import type { Events, Props } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = Props;
	type $$Events = Events;

	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { root }
	} = createLabel();

	const dispatch = createDispatcher();
	const attrs = getAttrs("root");

	$: builder = $root;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<label
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-mousedown={dispatch}
	>
		<slot {builder} />
	</label>
{/if}
