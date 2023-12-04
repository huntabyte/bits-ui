<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getFieldAttrs } from "../ctx.js";
	import type { InputProps } from "../types.js";

	type $$Props = InputProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { field },
		states: { segmentContents },
		ids
	} = getCtx();

	$: if (id) {
		ids.dateField.field.set(id);
	}

	const attrs = getFieldAttrs("input");

	$: builder = $field;
	$: Object.assign(builder, attrs);

	$: slotProps = {
		builder,
		segments: $segmentContents
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps}>
		<slot {...slotProps} />
	</div>
{/if}
