<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getFieldAttrs } from "../ctx.js";
	import type { SegmentEvents, SegmentProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = SegmentProps;
	type $$Events = SegmentEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let part: $$Props["part"];
	export let el: $$Props["el"] = undefined;

	const {
		elements: { segment },
		ids
	} = getCtx();

	$: if (id && part !== "literal") {
		ids.dateField[part].set(id);
	}

	const attrs = getFieldAttrs("segment");
	const dispatch = createDispatcher();

	$: builder = $segment(part);
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
		on:m-focusout={dispatch}
		on:m-focusout={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
