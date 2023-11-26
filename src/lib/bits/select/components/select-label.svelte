<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getGroupLabel, getAttrs, getCtx } from "../ctx.js";
	import type { LabelEvents, LabelProps } from "../types.js";

	type $$Props = LabelProps;
	type $$Events = LabelEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const { ids } = getCtx();
	const { groupLabel, id: groupId } = getGroupLabel();
	const attrs = getAttrs("label");

	$: if (id) {
		ids.label.set(id);
	}
	$: builder = $groupLabel(groupId);
	$: slotProps = { builder, attrs };
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
