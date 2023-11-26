<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { SegmentProps } from "../types.js";

	type $$Props = SegmentProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let part: $$Props["part"];

	const {
		elements: { segment },
		ids
	} = getCtx();

	if (id && part !== "literal") {
		ids[part].set(id);
	}

	const attrs = getAttrs("segment");

	$: builder = $segment(part);
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
