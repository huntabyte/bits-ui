<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getGroupCtx, getAttrs } from "../ctx.js";
	import type { GroupItemProps, GroupItemEvents } from "../types.js";
	import { createDispatcher } from "$lib/internal";

	type $$Props = GroupItemProps;
	type $$Events = GroupItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { item }
	} = getGroupCtx();

	const dispatch = createDispatcher();
	const attrs = getAttrs("group-item");

	$: builder = $item({ value, disabled });
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
