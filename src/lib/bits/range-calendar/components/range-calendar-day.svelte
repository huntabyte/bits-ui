<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { DayEvents, DayProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = DayProps;
	type $$Events = DayEvents;

	export let date: $$Props["date"];
	export let month: $$Props["month"];
	export let asChild: $$Props["asChild"] = false;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { cell },
		helpers: { isDateDisabled, isDateUnavailable }
	} = getCtx();

	const attrs = getAttrs("day");
	const dispatch = createDispatcher();

	$: builder = $cell(date, month);
	$: Object.assign(builder, attrs);
	$: disabled = $isDateDisabled(date);
	$: unavailable = $isDateUnavailable(date);
</script>

{#if asChild}
	<slot {builder} {disabled} {unavailable} />
{:else}
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-click={dispatch}
		on:m-focusin={dispatch}
		on:m-mouseenter={dispatch}
	>
		<slot {builder} {disabled} {unavailable}>
			{date.day}
		</slot>
	</div>
{/if}
