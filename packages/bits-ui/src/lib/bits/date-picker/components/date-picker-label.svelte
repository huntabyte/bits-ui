<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx } from "../ctx.js";
	import type { LabelProps } from "../index.js";

	type $$Props = LabelProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { label },
		ids,
		getFieldAttrs,
	} = getCtx();

	if (id) {
		ids.dateField.label.set(id);
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
