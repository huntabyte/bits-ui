<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { InputProps } from "../index.js";

	type $$Props = InputProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { field },
		states: { segmentContents },
		ids,
		getAttrs,
	} = getCtx();

	$: if (id) {
		ids.field.field.set(id);
	}

	const attrs = getAttrs("input");

	$: builder = $field;
	$: Object.assign(builder, attrs);
	$: segments = {
		start: $segmentContents.start,
		end: $segmentContents.end,
	};
</script>

{#if asChild}
	<slot {builder} {segments} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} {segments} />
	</div>
{/if}
