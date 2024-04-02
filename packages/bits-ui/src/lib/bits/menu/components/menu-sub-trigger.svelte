<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getSubTrigger } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../index.js";
	import { disabledAttrs } from "$lib/internal/index.js";
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
		ids,
		getAttrs,
		options,
	} = getSubTrigger();
	const { disabled: disabledStore } = options;

	const dispatch = createDispatcher();

	$: if (id) {
		ids.trigger.set(id);
	}

	$: builder = $subTrigger;
	$: attrs = {
		...getAttrs("sub-trigger"),
		...disabledAttrs(disabled || $disabledStore),
	};
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
		on:pointerenter
	>
		<slot {builder} />
	</div>
{/if}
