<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getFieldAttrs } from "../ctx.js";
	import type { SegmentProps } from "../types.js";

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
			ids.rangeField.start[part].set(id);
		} else {
			ids.rangeField.end[part].set(id);
		}
	}

	const attrs = getFieldAttrs("segment");

	$: builder = type === "start" ? $startSegment(part) : $endSegment(part);
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
