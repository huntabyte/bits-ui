<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { SegmentProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = SegmentProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let part: $$Props["part"];
	export let type: $$Props["type"];
	export let el: $$Props["el"] = undefined;

	const {
		elements: { startSegment, endSegment },
		ids
	} = getCtx();

	$: if (id && part !== "literal") {
		if (type === "start") {
			ids.start[part].set(id);
		} else {
			ids.end[part].set(id);
		}
	}

	const attrs = getAttrs("segment");
	const dispatch = createDispatcher();

	$: builder = type === "start" ? $startSegment(part) : $endSegment(part);
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
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
