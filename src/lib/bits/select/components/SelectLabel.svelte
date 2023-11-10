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

	$: if (id) {
		ids.label.set(id);
	}

	$: builder = $groupLabel(groupId);
	const attrs = getAttrs("label");
</script>

{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {builder} {attrs} />
	</div>
{/if}
