<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { SegmentProps } from "../types.js";

	type $$Props = SegmentProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let part: $$Props["part"];
	export let type: $$Props["type"];

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

	$: builder = type === "start" ? $startSegment(part) : $endSegment(part);

	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
