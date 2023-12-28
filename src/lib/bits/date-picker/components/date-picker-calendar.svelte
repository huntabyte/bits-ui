<script lang="ts">
	import { melt, type Month } from "@melt-ui/svelte";
	import { getCtx, getCalendarAttrs } from "../ctx.js";
	import type { CalendarEvents, CalendarProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";
	import type { DateValue } from "@internationalized/date";

	type $$Props = CalendarProps;
	type $$Events = CalendarEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;
	export let el: $$Props["el"] = undefined;

	const {
		elements: { calendar },
		states: { months: localMonths, weekdays },
		ids
	} = getCtx();

	$: if (id) {
		ids.calendar.calendar.set(id);
	}

	const attrs = getCalendarAttrs("root");
	const dispatch = createDispatcher();

	$: builder = $calendar;
	$: Object.assign(builder, attrs);
	let months: Month<DateValue>[] = $localMonths;
	$: months = $localMonths;
</script>

{#if asChild}
	<slot {builder} {months} weekdays={$weekdays} />
{:else}
	<div
		bind:this={el}
		use:melt={builder}
		{...$$restProps}
		on:m-keydown={dispatch}
	>
		<slot {builder} {months} weekdays={$weekdays} />
	</div>
{/if}
