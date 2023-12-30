<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { disabledAttrs } from "$lib/internal/index.js";
	import { getSubTrigger, getAttrs } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = SubTriggerProps & {
		disabled?: boolean;
	};
	type $$Events = SubTriggerEvents;
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { subTrigger },
		ids
	} = getSubTrigger();

	const dispatch = createDispatcher();

	$: if (id) {
		ids.trigger.set(id);
	}

	$: builder = $subTrigger;
	$: attrs = { ...getAttrs("sub-trigger"), ...disabledAttrs(disabled) };
	$: Object.assign(builder, attrs);
</script>

{#if asChild}
	<slot {builder} />
{:else}
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} />
	</div>
{/if}
