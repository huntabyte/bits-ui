<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getCalendarAttrs } from "../ctx.js";
	import type { CalendarEvents, CalendarProps } from "../types.js";
	import { createDispatcher } from "$lib/internal/events.js";

	type $$Props = CalendarProps;
	type $$Events = CalendarEvents;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { calendar },
		states: { months, weekdays },
		ids
	} = getCtx();

	$: if (id) {
		ids.calendar.calendar.set(id);
	}

	const attrs = getCalendarAttrs("root");
	const dispatch = createDispatcher();

	$: builder = $calendar;
	$: Object.assign(builder, attrs);

	$: slotProps = {
		builder,
		months: $months,
		weekdays: $weekdays
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} on:m-keydown={dispatch}>
		<slot {...slotProps} />
	</div>
{/if}
