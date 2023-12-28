<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getFieldAttrs } from "../ctx.js";
	import type { LabelProps } from "../types.js";

	type $$Props = LabelProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { label },
		ids
	} = getCtx();

	if (id) {
		ids.rangeField.field.label.set(id);
	}

	const attrs = getFieldAttrs("label");

	$: builder = $label;
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<span bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</span>
{/if}
