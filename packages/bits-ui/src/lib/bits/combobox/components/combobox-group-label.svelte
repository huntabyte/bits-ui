<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getGroupLabel, getCtx } from "../ctx.js";
	import type { GroupLabelEvents, GroupLabelProps } from "../types.js";

	type $$Props = GroupLabelProps;
	type $$Events = GroupLabelEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const { ids, getAttrs } = getCtx();
	const { groupLabel, id: groupId } = getGroupLabel();
	const attrs = getAttrs("group-label");

	$: if (id) {
		ids.label.set(id);
	}
	$: builder = $groupLabel(groupId);
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div bind:this={el} use:melt={builder} {...$$restProps}>
		<slot {builder} />
	</div>
{/if}
