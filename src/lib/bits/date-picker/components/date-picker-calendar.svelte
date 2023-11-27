<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getAttrs } from "../ctx.js";
	import type { CalendarProps } from "../types.js";

	type $$Props = CalendarProps;

	export let asChild: $$Props["asChild"] = false;
	export let id: $$Props["id"] = undefined;

	const {
		elements: { calendar },
		states: { months, daysOfWeek },
		ids
	} = getCtx();

	$: if (id) {
		ids.calendar.calendar.set(id);
	}

	$: builder = $calendar;
	const attrs = getAttrs("calendar");

	$: slotProps = {
		builder,
		attrs,
		months: $months,
		daysOfWeek: $daysOfWeek
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps} {...attrs}>
		<slot {...slotProps} />
	</div>
{/if}
