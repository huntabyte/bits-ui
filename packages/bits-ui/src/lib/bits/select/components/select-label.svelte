<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getGroupLabel } from "../ctx.js";
	import type { LabelEvents, LabelProps } from "../types.js";

	type $$Props = LabelProps;
	type $$Events = LabelEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const { ids, getAttrs } = getCtx();
	const { groupLabel, id: groupId } = getGroupLabel();
	const attrs = getAttrs("label");

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
