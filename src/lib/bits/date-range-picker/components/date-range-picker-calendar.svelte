<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getCalendarAttrs } from "../ctx.js";
	import type { CalendarProps } from "../types.js";

	type $$Props = CalendarProps;

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
	<div use:melt={builder} {...$$restProps}>
		<slot {...slotProps} />
	</div>
{/if}
