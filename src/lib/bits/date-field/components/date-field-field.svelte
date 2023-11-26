<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { FieldProps } from "../types.js";

	type $$Props = FieldProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { field },
		states: { segmentContents },
		ids
	} = getCtx();

	if (id) {
		ids.field.set(id);
	}

	const attrs = getAttrs("field");

	$: builder = $field;
	$: slotProps = {
		builder,
		attrs,
		segments: $segmentContents
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
