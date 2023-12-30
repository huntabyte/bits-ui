<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getGroupCtx, getAttrs } from "../ctx.js";
	import type { GroupItemProps, GroupItemEvents } from "../types.js";
	import { createDispatcher, disabledAttrs } from "$lib/internal/index.js";

	type $$Props = GroupItemProps;
	type $$Events = GroupItemEvents;

	export let value: $$Props["value"];
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { item }
	} = getGroupCtx();

	const dispatch = createDispatcher();
	$: attrs = { ...getAttrs("group-item"), ...disabledAttrs(disabled) };

	$: builder = $item({ value, disabled });
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<button
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-keydown={dispatch}
	>
		<slot {builder} />
	</button>
{/if}
