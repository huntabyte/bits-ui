<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { LabelProps } from "../types.js";

	type $$Props = LabelProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { label },
		ids
	} = getCtx();

	if (id) {
		ids.dateField.label.set(id);
	}

	const attrs = getAttrs("label");

	$: builder = $label;
	$: slotProps = {
		builder,
		attrs
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<span use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</span>
{/if}
