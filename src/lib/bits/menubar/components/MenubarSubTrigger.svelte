<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { disabledAttrs } from "$lib/internal/helpers.js";
	import { ctx } from "../ctx.js";
	import type { SubTriggerEvents, SubTriggerProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = SubTriggerProps;
	type $$Events = SubTriggerEvents;
	export let disabled = false;
	export let asChild = false;
	const {
		elements: { subTrigger }
	} = ctx.getSub();
	const dispatch = createDispatcher();
	$: builder = $subTrigger;
	$: attrs = { ...ctx.getAttrs("sub-trigger"), ...disabledAttrs(disabled) };
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
