<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { disabledAttrs } from "$lib/internal/index.js";
	import { getSubMenuCtx, getAttrs } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = SubTriggerProps;
	type $$Events = SubTriggerEvents;
	export let disabled: $$Props["disabled"] = false;
	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { subTrigger },
		ids
	} = getSubMenuCtx();

	const dispatch = createDispatcher();

	$: if (id) {
		ids.trigger.set(id);
	}
	$: builder = $subTrigger;
	$: attrs = { ...getAttrs("sub-trigger"), ...disabledAttrs(disabled) };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->
{#if asChild}
	<slot {builder} {attrs} />
{:else}
	<div
		use:melt={builder}
		{...$$restProps}
		{...attrs}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-focusout={dispatch}
		on:m-keydown={dispatch}
		on:m-pointerleave={dispatch}
		on:m-pointermove={dispatch}
	>
		<slot {builder} {attrs} />
	</div>
{/if}
