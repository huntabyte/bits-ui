<script lang="ts">
	import { melt } from "@melt-ui/svelte";
	import { getCtx, getCalendarAttrs } from "../ctx.js";
	import type { DateProps } from "../types.js";

	type $$Props = DateProps;

	export let date: $$Props["date"];
	export let month: $$Props["month"];
	export let asChild: $$Props["asChild"] = false;

	const {
		elements: { cell },
		helpers: { isDateDisabled, isDateUnavailable }
	} = getCtx();

	const attrs = getCalendarAttrs("date");

	$: builder = $cell(date, month);
	$: Object.assign(builder, attrs);

	$: slotProps = {
		builder,
		disabled: $isDateDisabled(date),
		unavailable: $isDateUnavailable(date)
	};
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<div use:melt={builder} {...$$restProps}>
		<slot {...slotProps}>
			{date.day}
		</slot>
	</div>
{/if}
