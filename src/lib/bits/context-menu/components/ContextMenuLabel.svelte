<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getGroupLabel, getAttrs } from "../ctx.js";
	import type { LabelProps } from "../types.js";

	type $$Props = LabelProps;

	export let asChild: $$Props["asChild"] = false;

	const { groupLabel, id } = getGroupLabel();
	const attrs = getAttrs("label");

	$: builder = $groupLabel(id);

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
