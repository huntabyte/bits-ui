<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { field },
		states: { segmentContents },
		ids
	} = getCtx();

	$: if (id) {
		ids.field.set(id);
	}

	const attrs = getAttrs("input");

	$: builder = $field;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} segments={$segmentContents} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} segments={$segmentContents} />
	</div>
{/if}
